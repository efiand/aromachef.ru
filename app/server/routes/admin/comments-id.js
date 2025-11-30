import { processDb } from "#server/lib/db.js";

const COMMENTS_QUERY = /* sql */ `
	SELECT c.id, answer, c.published, DATE_FORMAT(c.publishedAt, '%Y-%m-%d %H:%i') as publishedAt, r.title as recipeTitle
	FROM comments c JOIN recipes r
	WHERE c.recipeId = r.id AND r.id = ?
	ORDER BY c.id DESC;
`;

export const commentsIdAdminRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		/** @type {{ answer: string?; id: number; published: boolean; publishedAt: string?; recipeTitle: string }[]} */
		const comments = await processDb(COMMENTS_QUERY, id);

		const pageTemplate = comments.length
			? /* html */ `
				<p>Просмотр рецепта: <a href="/recipe/${id}" target="_blank">${comments[0]?.recipeTitle || id}</a></p>
				<ul class="tags tags--column">${comments.map(renderItem).join("")}</ul>
			`
			: /* html */ `
				<p><a href="/recipe/${id}" target="_blank">Просмотр рецепта</a></p>
				<p>Комментариев нет.</p>
			`;

		return {
			page: {
				heading: `Комментарии к рецепту ${id}`,
				pageTemplate,
			},
		};
	},
};

/** @type {(params: { answer: string?; id: number; published: boolean; publishedAt: string? }) => string} */
function renderItem({ answer = "", id, published, publishedAt = "" }) {
	return /* html */ `
		<li class="tags__item">
			<a class="tags__link" href="/admin/comment/${id}">
				${id} – ${published ? `опубликован ${publishedAt}` : "не опубликован"}
				${answer ? "" : "(без ответа)"}
			</a>
		</li>
	`;
}

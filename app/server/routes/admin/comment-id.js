import { renderCommentForm } from "#common/templates/comment-form.js";
import { getDbError, processDb } from "#server/lib/db.js";
import { resetPageCache } from "#server/lib/pages-cache.js";
import { prepareAndMinifyHtml, prepareText } from "#server/lib/prepare-text.js";

const COMMENT_QUERY = /* sql */ `
	SELECT name, text, answer, c.published, recipeId, r.title as recipeTitle
	FROM comments c JOIN recipes r
	WHERE c.id = ? AND c.recipeId = r.id
	ORDER BY c.id DESC;
`;
const DELETE_COMMENT_QUERY = /* sql */ `DELETE FROM comments WHERE id = ?`;
const UPDATE_COMMENT_QUERY = /* sql */ `
	UPDATE comments
	SET name = ?, text = ?, answer = ?, published = ?
	WHERE id = ?;
`;

export const commentIdAdminRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		/** @type {RecipeCommentInForm[]} */
		const [data] = await processDb(COMMENT_QUERY, id);

		if (data) {
			return getView(data);
		}

		return { redirect: `/admin` };
	},

	/** @type {RouteMethod} */
	async POST({ body, id }) {
		const { action, answer, name, published, recipeId, recipeTitle, text } = /** @type {RecipeCommentInForm} */ (body);
		let error = "";

		const preparedName = name ? prepareText(name) : "Гость";
		const preparedText = await prepareAndMinifyHtml(text);
		const preparedAnswer = answer ? await prepareAndMinifyHtml(answer) : null;

		if (action === "delete") {
			try {
				await processDb(DELETE_COMMENT_QUERY, id);
				resetPageCache("/comments/");
			} catch (deletingError) {
				error = /* html */ `<b>Ошибка удаления комментария:</b> ${getDbError(deletingError)}`;
			}
		} else {
			try {
				const payload = [preparedName, preparedText, preparedAnswer, published ? 1 : 0, id];
				await processDb(UPDATE_COMMENT_QUERY, payload);
				if (published) {
					resetPageCache("/comments/");
				}
			} catch (updatingError) {
				error = /* html */ `<b>Ошибка изменения комментария:</b> ${getDbError(updatingError)}`;
			}
		}

		if (error) {
			return getView(
				{ answer: preparedAnswer, name: preparedName, published, recipeId, recipeTitle, text: preparedText },
				error,
			);
		}

		return { redirect: `/admin/comments/${recipeId}` };
	},
};

/** @type {(data: RecipeCommentInForm, error?: string) => RouteData} */
function getView(data, error = "") {
	return {
		page: {
			heading: "Редактировать комментарий",
			pageTemplate: renderCommentForm(data, error),
		},
	};
}

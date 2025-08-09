import { renderCards } from "#!/templates/cards.js";
import { renderPageSection } from "#!/templates/page-section.js";
import { sql } from "#!/utils/mark-template.js";
import { isDev } from "#server/constants.js";
import { getFromDb } from "#server/lib/db.js";

const query = sql`
	SELECT r.id, r.title, t.title AS tag FROM recipes r JOIN tags t JOIN recipesTags rt
	WHERE rt.recipeId = r.id
	AND rt.tagId = t.id
	AND t.id = ?
	${isDev ? "" : sql`AND r.published = 1`}
	ORDER BY r.title;
`;

export const tagIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		const cards = await getFromDb(query, id);

		if (!cards.length) {
			throw new Error("Тег не существует.", { cause: 404 });
		}

		const [{ id: recipeId, tag }] = cards;
		const title = `#${tag}`;

		return {
			page: {
				description: `Страница содержит рецепты с эфирными маслами на тему «${tag}».`,
				heading: `Теги : ${title}`,
				ogImage: `/pictures/recipe/${recipeId}@2x.webp`,
				pageTemplate: renderPageSection({
					footerTemplate: renderCards({
						alt: `На фото изображено готовое блюдо [title] на тему «${tag}» в миниатюре.`,
						cards,
					}),
					title,
				}),
			},
		};
	},
};

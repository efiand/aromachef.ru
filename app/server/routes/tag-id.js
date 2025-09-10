import { renderCards } from "#common/components/cards.js";
import { renderPageSection } from "#common/components/page-section.js";
import { sql } from "#common/utils/mark-template.js";
import { capitalize } from "#common/utils/text.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";

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
		const cards = await processDb(query, id);

		if (!cards.length) {
			throw new Error("Тег не существует.", { cause: 404 });
		}

		const [{ id: recipeId, tag }] = cards;

		return {
			page: {
				description: `Страница содержит рецепты с эфирными маслами на тему «${tag}».`,
				heading: `${capitalize(tag)} | Теги`,
				ogImage: `/pictures/recipe/${recipeId}@2x.webp`,
				pageTemplate: renderPageSection({
					footerTemplate: renderCards({
						alt: `На фото изображено готовое блюдо [title] на тему «${tag}» в миниатюре.`,
						cards,
					}),
					title: `#${tag}`,
				}),
			},
		};
	},
};

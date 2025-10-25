import { renderStructure } from "#common/components/structure.js";
import { sql } from "#common/utils/mark-template.js";
import { capitalize } from "#common/utils/text.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";

const queryCondition = isDev ? "" : sql`AND r.published = 1`;
const recipesQuery = sql`
	SELECT r.id, title FROM recipes r JOIN recipesTags rt
	WHERE rt.recipeId = r.id AND rt.tagId = ? ${queryCondition}
	ORDER BY title;
`;
const tagsQuery = sql`
	SELECT id, title, (id = ?) AS current FROM tags
		WHERE (
			SELECT count(r.id) FROM recipes r WHERE r.id IN (
				SELECT recipeId FROM recipesTags WHERE tagId = id
			)
			${queryCondition}
		) > 0
	ORDER BY title;
`;

export const tagIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		/** @type {[DbItem[], DbItem[]]} */
		const [cards, tags] = await Promise.all([processDb(recipesQuery, id), processDb(tagsQuery, id)]);

		if (!cards.length) {
			throw new Error("Тег не существует.", { cause: 404 });
		}

		const heading = tags.find((item) => item.id === id)?.title || "";
		const [{ id: recipeId }] = cards;

		return {
			page: {
				description: `Страница содержит рецепты с эфирными маслами на тему «${heading}».`,
				heading: `${capitalize(heading)} | Теги`,
				ogImage: `/pictures/recipe/${recipeId}@2x.webp`,
				pageTemplate: renderStructure({
					alt: `На фото изображено готовое блюдо [title] на тему «${heading}» в миниатюре.`,
					asideHeading: "Теги",
					cards,
					heading: `#${heading}`,
					tags,
				}),
			},
		};
	},
};

import { renderPageSection } from "#!/templates/page-section.js";
import { renderRecipeDescription } from "#!/templates/recipe-description.js";
import { renderRecipeFooter } from "#!/templates/recipe-footer.js";
import { html, sql } from "#!/utils/mark-template.js";
import { isDev, picturesHost } from "#server/constants.js";
import { getFromDb } from "#server/lib/db.js";

const recipesQuery = sql`
	SELECT cooking, description, ingredients, structureId, telegramId, r.title,
	s.title AS structureTitle FROM recipes r JOIN structures s
	WHERE r.id = ? AND s.id = r.structureId ${isDev ? "" : sql`AND r.published = 1`};
`;
const tagsQuery = sql`
	SELECT t.id, t.title FROM tags t JOIN recipesTags rt
	WHERE rt.recipeId = ? AND rt.tagId = t.id
	ORDER BY t.title;
`;

export const recipeIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		/** @type {[[Recipe], DbItem[]]} */
		const [[recipe], tags] = await Promise.all([getFromDb(recipesQuery, id), getFromDb(tagsQuery, id)]);

		if (!recipe) {
			throw new Error("Рецепт не существует.", { cause: 404 });
		}

		const { cooking, description, ingredients, structureId, structureTitle, telegramId, title } = recipe;
		const imagePrefix = `${picturesHost}/pictures/recipe/${id}`;

		return {
			page: {
				description: description
					? description.replace(/<(\/?)([a-z]+)[^>]*(>|$)/gi, "")
					: `Страница содержит описание рецепта «${title}».`,
				heading: `Рецепты : ${title}`,
				ogImage: `${imagePrefix}@2x.webp`,
				pageTemplate: renderPageSection({
					articles: [
						{
							content: html`<h2>Состав</h2>${ingredients}`,
							imageAlias: `${imagePrefix}-ingredients`,
						},
						{
							content: html`<h2>Приготовление</h2>${cooking}`,
							imageAlias: `${imagePrefix}-cooking`,
						},
					],
					content: renderRecipeDescription({ description, telegramId }),
					footerTemplate: renderRecipeFooter({ structure: { id: structureId, title: structureTitle }, tags }),
					title,
				}),
			},
		};
	},
};

import { renderPageSection } from "#!/templates/page-section.js";
import { renderRecipeDescription } from "#!/templates/recipe-description.js";
import { renderRecipeFooter } from "#!/templates/recipe-footer.js";
import { html, sql } from "#!/utils/mark-template.js";
import { isDev, picturesHost } from "#server/constants.js";
import { getFromDb } from "#server/lib/db.js";

const queryCondition = isDev ? "" : sql`AND r.published = 1`;

const maxRecipeQuery = sql`SELECT MAX(id) AS length FROM recipes ${isDev ? "" : sql`WHERE published = 1`}`;
const recipesQuery = sql`
	SELECT cooking, description, ingredients, structureId, telegramId, r.title,
	s.title AS structureTitle FROM recipes r JOIN structures s
	WHERE r.id = ? AND s.id = r.structureId ${queryCondition};
`;
const relatedRecipesQuery = sql`
	SELECT r.id, r.title FROM recipes r JOIN recipesRecipes rr
	WHERE rr.recipeId = ? AND rr.relatedRecipeId = r.id ${queryCondition}
	ORDER BY r.title;
`;
const tagsQuery = sql`
	SELECT t.id, t.title FROM tags t JOIN recipesTags rt
	WHERE rt.recipeId = ? AND rt.tagId = t.id
	ORDER BY t.title;
`;

export const recipeIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		/** @type {[[{ length: number }], [Recipe], DbItem[], DbItem[]]} */
		const [[{ length }], [recipe], relatedRecipes, tags] = await Promise.all([
			getFromDb(maxRecipeQuery),
			getFromDb(recipesQuery, id),
			getFromDb(relatedRecipesQuery, id),
			getFromDb(tagsQuery, id),
		]);

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
					footerTemplate: renderRecipeFooter({
						next: id === length ? 1 : id + 1,
						picturesHost,
						prev: id === 1 ? length : id - 1,
						relatedRecipes,
						structure: { id: structureId, title: structureTitle },
						tags,
					}),
					title,
				}),
			},
		};
	},
};

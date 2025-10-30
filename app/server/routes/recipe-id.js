import { renderPageSection } from "#common/components/page-section.js";
import { renderRecipeFooter } from "#common/components/recipe-footer.js";
import { html, sql } from "#common/utils/mark-template.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";
import { prepareText } from "#server/lib/prepare-text.js";
import { renderRecipeDescription } from "#server/lib/recipe-description.js";
import { sendTgMessage } from "#server/lib/telegram.js";

const { TG_AROMACHEF_ID } = process.env;

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
const commentsQuery = sql`
	SELECT name, text, answer FROM comments
	WHERE recipeId = ? ${isDev ? "" : sql`AND published = 1`}
	ORDER BY publishedAt DESC;
`;
const addCommentQuery = sql`
	INSERT INTO comments (name, text, recipeId) VALUES (?, ?, ?);
`;

export const recipeIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id, isAmp, body }) {
		if (typeof body.comments !== "undefined") {
			/** @type {RecipeComment[]} */
			const comments = await processDb(commentsQuery, id);
			return {
				contentType: "application/json",
				template: JSON.stringify({ comments }),
			};
		}

		/** @type {[[{ length: number }], [Recipe], DbItem[], DbItem[]]} */
		const [[{ length }], [recipe], relatedRecipes, tags] = await Promise.all([
			processDb(maxRecipeQuery),
			processDb(recipesQuery, id),
			processDb(relatedRecipesQuery, id),
			processDb(tagsQuery, id),
		]);

		if (!recipe) {
			throw new Error("Рецепт не существует.", { cause: 404 });
		}

		const { cooking, description, ingredients, structureId, structureTitle, telegramId, title } = recipe;
		const imageAlias = `/pictures/recipe/${id}`;

		return {
			page: {
				description: description
					? description.replace(/<(\/?)([a-z]+)[^>]*(>|$)/gi, "")
					: `Страница содержит описание рецепта «${title}».`,
				heading: `${title} | Рецепты`,
				ogImage: `${imageAlias}@2x.webp`,
				pageTemplate: renderPageSection({
					articles: [
						{
							isAmp,
							content: html`<h2>Состав</h2>${ingredients}`,
							imageAlias: `${imageAlias}-ingredients`,
						},
						{
							isAmp,
							content: html`<h2>Приготовление</h2>${cooking}`,
							imageAlias: `${imageAlias}-cooking`,
						},
					],
					content: renderRecipeDescription({ description, telegramId }),
					footerTemplate: renderRecipeFooter({
						isAmp,
						relatedRecipes,
						structure: { id: structureId, title: structureTitle },
						tags,
					}),
					next: `/recipe/${id === length ? 1 : id + 1}`,
					prev: `/recipe/${id === 1 ? length : id - 1}`,
					title,
				}),
			},
		};
	},

	/** @type {RouteMethod} */
	async POST({ body, id }) {
		const name = body.name ? prepareText(body.name, true) : "Гость";
		const text = prepareText(html`<p>${body.text.replaceAll("\n", "</p><p>")}</p>`);
		await processDb(addCommentQuery, [name, text, id]);

		await Promise.all([
			sendTgMessage({ text: "Новый комментарий!" }),
			sendTgMessage({ chat: { id: TG_AROMACHEF_ID }, text: "Новый комментарий!" }),
		]);

		return {
			template: html`<p>Комментарий отправлен на модерацию.</p>`,
		};
	},
};

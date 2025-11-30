import { renderPageSection } from "#common/templates/page-section.js";
import { renderRecipeFooter } from "#common/templates/recipe-footer.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";
import { prepareText } from "#server/lib/prepare-text.js";
import { renderRecipeDescription } from "#server/lib/recipe-description.js";
import { sendTgMessage } from "#server/lib/telegram.js";

const { TG_AROMACHEF_ID } = process.env;

const ADD_COMMENT_QUERY = /* sql */ `
	INSERT INTO comments (name, text, recipeId) VALUES (?, ?, ?);
`;
const COMMENTS_QUERY = /* sql */ `
	SELECT id, name, text, answer FROM comments
	WHERE recipeId = ? AND published = 1
	ORDER BY publishedAt DESC;
`;
const TAGS_QUERY = /* sql */ `
	SELECT t.id, t.title FROM tags t JOIN recipesTags rt
	WHERE rt.recipeId = ? AND rt.tagId = t.id
	ORDER BY t.title;
`;

const maxRecipeQuery = /* sql */ `SELECT MAX(id) AS length FROM recipes`;
const maxRecipeQueryWithPublishedOnly = /* sql */ `SELECT MAX(id) AS length FROM recipes WHERE published = 1`;

const recipesQuery = getRecipesQuery();
const recipesQueryWithPublishedOnly = getRecipesQuery(/* sql */ `AND r.published = 1`);

const relatedRecipesQuery = getRelatedRecipesQuery();
const relatedRecipesQueryWithPublishedOnly = getRelatedRecipesQuery(/* sql */ `AND r.published = 1`);

export const recipeIdRoute = {
	/** @type {RouteMethod} */
	async GET({ authorized, id, isAmp, body }) {
		const needUnpublished = isDev || (authorized && typeof body.preview !== "undefined");

		if (typeof body.comments !== "undefined") {
			/** @type {RecipeComment[]} */
			const comments = await processDb(COMMENTS_QUERY, id);
			return {
				contentType: "application/json",
				template: JSON.stringify({ comments }),
			};
		}

		/** @type {[[{ length: number }], [Recipe], DbItem[], DbItem[]]} */
		const [[{ length }], [recipe], relatedRecipes, tags] = await Promise.all([
			processDb(needUnpublished ? maxRecipeQuery : maxRecipeQueryWithPublishedOnly),
			processDb(needUnpublished ? recipesQuery : recipesQueryWithPublishedOnly, id),
			processDb(needUnpublished ? relatedRecipesQuery : relatedRecipesQueryWithPublishedOnly, id),
			processDb(TAGS_QUERY, id),
		]);

		if (!recipe) {
			throw new Error("Рецепт не существует.", { cause: 404 });
		}

		const { cooking, description, ingredients, ingredientsExtra, structureId, structureTitle, telegramId, title } =
			recipe;
		const imageAlias = `/pictures/recipe/${id}`;

		const ingredientsExtraTemplate = ingredientsExtra
			? /* html */ `<p><strong>По желанию:</strong></p>${ingredientsExtra}`
			: "";

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
							content: /* html */ `<h2>Состав</h2>${ingredients}${ingredientsExtraTemplate}`,
							imageAlias: `${imageAlias}-ingredients`,
							isAmp,
						},
						{
							content: /* html */ `<h2>Приготовление</h2>${cooking}`,
							imageAlias: `${imageAlias}-cooking`,
							isAmp,
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
		const { name, text } = /** @type {PostedComment} */ (body);
		/** @type {import('mysql2').ResultSetHeader} */
		const { insertId } = await processDb(ADD_COMMENT_QUERY, [
			name ? prepareText(name, true) : "Гость",
			/* html */ `<p>${prepareText(text, true).replaceAll("\n", "</p><p>")}</p>`,
			id,
		]);

		const tgAnswer = `Новый комментарий!\nhttps://aromachef.ru/admin/comment/${insertId}`;

		await Promise.all([
			sendTgMessage({ text: tgAnswer }),
			sendTgMessage({ chat: { id: TG_AROMACHEF_ID }, text: tgAnswer }),
		]);

		return {
			template: /* html */ `<p>Комментарий отправлен на модерацию.</p>`,
		};
	},
};

function getRecipesQuery(queryCondition = "") {
	return /* sql */ `
		SELECT cooking, description, ingredients, ingredientsExtra, structureId, telegramId, r.title,
		s.title AS structureTitle FROM recipes r JOIN structures s
		WHERE r.id = ? AND s.id = r.structureId ${queryCondition};
	`;
}

function getRelatedRecipesQuery(queryCondition = "") {
	return /* sql */ `
		SELECT r.id, r.title FROM recipes r JOIN recipesRecipes rr
		WHERE rr.recipeId = ? AND rr.relatedRecipeId = r.id ${queryCondition}
		ORDER BY r.title;
	`;
}

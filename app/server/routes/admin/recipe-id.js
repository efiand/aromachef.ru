import { renderRecipeForm } from "#common/templates/recipe-form.js";
import { getDbError, processDb } from "#server/lib/db.js";
import { processImage } from "#server/lib/image.js";
import { getStructuresAndTags } from "#server/lib/structures-and-tags.js";

const CREATE_RECIPE_QUERY = /* sql */ `
	INSERT INTO recipes
		(title, description, ingredients, ingredientsExtra, cooking, structureId, telegramId, published)
	VALUES(?, ?, ?, ?, ?, ?, ?, ?);
`;
const RECIPE_QUERY = /* sql */ `
	SELECT cooking, description, ingredients, ingredientsExtra, published, structureId, telegramId, title
	FROM recipes
	WHERE id = ?;
`;
const RECIPES_QUERY = /* sql */ `SELECT id, title FROM recipes ORDER BY title;`;
const RELATED_RECIPES_QUERY = /* sql */ `
	SELECT r.id, r.title FROM recipes r JOIN recipesRecipes rr
	WHERE rr.recipeId = ? AND rr.relatedRecipeId = r.id
	ORDER BY r.title;
`;
const TAGS_QUERY = /* sql */ `
	SELECT t.id FROM tags t JOIN recipesTags rt
	WHERE rt.recipeId = ? AND rt.tagId = t.id
	ORDER BY t.title;
`;
const UPDATE_RECIPE_QUERY = /* sql */ `
	UPDATE recipes
	SET title = ?, description = ?, ingredients = ?, ingredientsExtra = ?, cooking = ?, structureId = ?, telegramId = ?, published = ?
	WHERE id = ?;
`;

export const recipeIdAdminRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		return getView({
			id,
			recipeData: id
				? undefined
				: {
						cooking: "",
						description: "",
						ingredients: "",
						ingredientsExtra: "",
						published: false,
						structureId: 0,
						telegramId: null,
						title: "",
					},
		});
	},

	/** @type {RouteMethod} */
	async POST({ body }) {
		const {
			cache,
			cooking,
			cookingImage,
			description,
			id,
			ingredients,
			ingredientsExtra,
			ingredientsImage,
			published,
			"relatedIds[]": rawRelatedIds = [],
			structureId: rawStructureId,
			"tagIds[]": rawTagIds = [],
			telegramId: rawTelegramId,
			title,
		} = /** @type {PostedRecipe} */ (body);
		const errors = /** @type {string[]} */ ([]);
		const { oldRelatedIds, oldTagIds } = /** @type {RecipeCache} */ (JSON.parse(cache));
		const creatingRelatedIds = /** @type {number[]} */ ([]);
		const creatingTagIds = /** @type {number[]} */ ([]);
		const deletingRelatedIds = /** @type {number[]} */ ([]);
		const deletingTagIds = /** @type {number[]} */ ([]);

		const relatedIds = rawRelatedIds.map(Number);
		const tagIds = rawTagIds.map(Number);
		const telegramId = parseInt(rawTelegramId, 10) || null;
		const structureId = parseInt(rawStructureId, 10);
		const payload = [
			title,
			description,
			ingredients,
			ingredientsExtra || null,
			cooking,
			structureId,
			telegramId,
			published ? 1 : 0,
		];
		let newId = parseInt(id, 10);

		if (newId) {
			try {
				await processDb(UPDATE_RECIPE_QUERY, [...payload, newId]);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка обновления рецепта:</b> ${getDbError(error)}`);
			}
		} else {
			try {
				/** @type {import('mysql2').ResultSetHeader} */
				(({ insertId: newId } = await processDb(CREATE_RECIPE_QUERY, payload)));
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка ${newId ? "обновления" : "создания"} рецепта:</b> ${getDbError(error)}`);
			}
		}

		relatedIds.forEach((recipeId) => {
			if (!oldRelatedIds.includes(recipeId)) {
				creatingRelatedIds.push(recipeId);
			}
		});
		oldRelatedIds.forEach((recipeId) => {
			if (!relatedIds.includes(recipeId)) {
				deletingRelatedIds.push(recipeId);
			}
		});
		if (creatingRelatedIds.length) {
			try {
				const rows = creatingRelatedIds.map((recipeId) => [newId, recipeId]);
				const placeholders = rows.map(() => "(?, ?)").join(", ");
				await processDb(
					/* sql */ `INSERT INTO recipesRecipes (recipeId, relatedRecipeId) VALUES ${placeholders}`,
					rows.flat(),
				);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка добавления связи с другими рецептами:</b> ${error}`);
			}
		}
		if (deletingRelatedIds.length) {
			try {
				const placeholders = deletingRelatedIds.map(() => "?").join(", ");
				await processDb(
					/* sql */ `DELETE FROM recipesRecipes WHERE recipeId = ? AND relatedRecipeId IN (${placeholders})`,
					[newId, ...deletingRelatedIds],
				);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка удаления связи с другими рецептами:</b> ${error}`);
			}
		}

		tagIds.forEach((tagId) => {
			if (!oldTagIds.includes(tagId)) {
				creatingTagIds.push(tagId);
			}
		});
		oldTagIds.forEach((tagId) => {
			if (!tagIds.includes(tagId)) {
				deletingTagIds.push(tagId);
			}
		});
		if (creatingTagIds.length) {
			try {
				const rows = creatingTagIds.map((tagId) => [newId, tagId]);
				const placeholders = rows.map(() => "(?, ?)").join(", ");

				await processDb(/* sql */ `INSERT INTO recipesTags (recipeId, tagId) VALUES ${placeholders}`, rows.flat());
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка добавления связи с тегами:</b> ${error}`);
			}
		}
		if (deletingTagIds.length) {
			try {
				const placeholders = deletingTagIds.map(() => "?").join(", ");
				await processDb(/* sql */ `DELETE FROM recipesTags WHERE recipeId = ? AND tagId IN (${placeholders})`, [
					newId,
					...deletingTagIds,
				]);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка удаления связи с тегами:</b> ${error}`);
			}
		}

		if (ingredientsImage) {
			try {
				await processImage(ingredientsImage, `${newId}-ingredients`);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка добавления изображения для состава:</b> ${error}`);
			}
		}

		if (cookingImage) {
			try {
				await processImage(cookingImage, `${newId}-cooking`);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка добавления изображения для приготовления:</b> ${error}`);
			}
		}

		if (errors.length) {
			return getView({
				errors,
				id: newId,
				recipeData: {
					cooking,
					description,
					ingredients,
					ingredientsExtra,
					published: Boolean(published),
					structureId,
					telegramId,
					title,
				},
			});
		}

		return { redirect: `/recipe/${newId}${published ? "" : "?preview"}` };
	},
};

/** @type {(data: { errors?: string[]; id: number; recipeData?: RecipeInForm }) => Promise<RouteData>} */
async function getView({ errors = [], id, recipeData }) {
	const [structures, tags] = await getStructuresAndTags(false);

	/** @type {[[RecipeInForm], DbItem[], DbItem[], DbItem[]]} */
	const [[recipe], relatedRecipes, recipeTags, recipes] = await Promise.all([
		recipeData ? [recipeData] : processDb(RECIPE_QUERY, id),
		processDb(RELATED_RECIPES_QUERY, id),
		processDb(TAGS_QUERY, id),
		processDb(RECIPES_QUERY),
	]);

	return {
		page: {
			heading: id ? `Редактировать рецепт № ${id}` : "Добавить рецепт",
			pageTemplate: renderRecipeForm(
				{
					...recipe,
					id,
					recipes,
					relatedIds: relatedRecipes.map(({ id }) => id),
					structures,
					tagIds: recipeTags.map(({ id }) => id),
					tags,
				},
				errors,
			),
		},
	};
}

import { renderArticleForm } from '#common/templates/article-form.js';
import { getDbError, processDb } from '#server/lib/db.js';
import { processImage } from '#server/lib/image.js';
import { resetPageCache } from '#server/lib/pages-cache.js';
import { prepareAndMinifyHtml, prepareText } from '#server/lib/prepare-text.js';

const CREATE_ARTICLE_QUERY = /* sql */ `
	INSERT INTO articles (title, description, content, published)
	VALUES(?, ?, ?, ?);
`;
const ARTICLE_QUERY = /* sql */ `
	SELECT content, description, published, title FROM articles WHERE id = ?;
`;
const ARTICLES_QUERY = /* sql */ `SELECT id, title FROM articles ORDER BY title;`;
const ARTICLE_RECIPES_QUERY = /* sql */ `
	SELECT r.id, r.title FROM recipes r JOIN articlesRecipes ar
	WHERE ar.articleId = ? AND ar.recipeId = r.id
	ORDER BY r.title;
`;
const RECIPES_QUERY = /* sql */ `SELECT id, title FROM recipes ORDER BY title;`;
const RELATED_ARTICLES_QUERY = /* sql */ `
	SELECT a.id, a.title FROM articles a JOIN articlesArticles aa
	WHERE aa.articleId = ? AND aa.relatedArticleId = a.id
	ORDER BY a.title;
`;
const UPDATE_ARTICLE_QUERY = /* sql */ `
	UPDATE articles SET title = ?, description = ?, content = ?, published = ? WHERE id = ?;
`;

export const articleIdAdminRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		return getView({
			articleData: id ? undefined : { content: '', description: '', published: false, title: '' },
			id,
		});
	},

	/** @type {RouteMethod} */
	async POST({ body }) {
		const {
			cache,
			content,
			description,
			id,
			contentImage,
			published,
			'relatedIds[]': rawRelatedIds = [],
			'recipeIds[]': rawTRecipeIds = [],
			title,
		} = /** @type {PostedArticle} */ (body);
		const errors = /** @type {string[]} */ ([]);
		const { oldRecipeIds, oldRelatedIds } = /** @type {ArticleCache} */ (JSON.parse(cache));
		const creatingRelatedIds = /** @type {number[]} */ ([]);
		const creatingRecipeIds = /** @type {number[]} */ ([]);
		const deletingRelatedIds = /** @type {number[]} */ ([]);
		const deletingRecipeIds = /** @type {number[]} */ ([]);

		const relatedIds = rawRelatedIds.map(Number);
		const recipeIds = rawTRecipeIds.map(Number);

		const preparedTitle = prepareText(title);
		const [preparedDescription, preparedContent] = await Promise.all([
			prepareAndMinifyHtml(description),
			prepareAndMinifyHtml(content),
		]);

		const payload = [preparedTitle, preparedDescription, preparedContent, published ? 1 : 0];
		let newId = parseInt(id, 10);

		if (newId) {
			try {
				await processDb(UPDATE_ARTICLE_QUERY, [...payload, newId]);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка обновления статьи:</b> ${getDbError(error)}`);
			}
		} else {
			try {
				/** @type {import('mysql2').ResultSetHeader} */
				(({ insertId: newId } = await processDb(CREATE_ARTICLE_QUERY, payload)));
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка создания статьи:</b> ${getDbError(error)}`);
			}
		}

		relatedIds.forEach((articleId) => {
			if (!oldRelatedIds.includes(articleId)) {
				creatingRelatedIds.push(articleId);
			}
		});
		oldRelatedIds.forEach((articleId) => {
			if (!relatedIds.includes(articleId)) {
				deletingRelatedIds.push(articleId);
			}
		});
		if (creatingRelatedIds.length) {
			try {
				const rows = creatingRelatedIds.map((articleId) => [newId, articleId]);
				const placeholders = rows.map(() => '(?, ?)').join(', ');
				await processDb(
					/* sql */ `INSERT INTO articlesArticles (articleId, relatedArticleId) VALUES ${placeholders}`,
					rows.flat(),
				);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка добавления связей с другими статьями:</b> ${error}`);
			}
		}
		if (deletingRelatedIds.length) {
			try {
				const placeholders = deletingRelatedIds.map(() => '?').join(', ');
				await processDb(
					/* sql */ `DELETE FROM articlesArticles WHERE articleId = ? AND relatedArticleId IN (${placeholders})`,
					[newId, ...deletingRelatedIds],
				);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка удаления связей с другими статьями:</b> ${error}`);
			}
		}

		recipeIds.forEach((recipeId) => {
			if (!oldRecipeIds.includes(recipeId)) {
				creatingRecipeIds.push(recipeId);
			}
		});
		oldRecipeIds.forEach((recipeId) => {
			if (!recipeIds.includes(recipeId)) {
				deletingRecipeIds.push(recipeId);
			}
		});
		if (creatingRecipeIds.length) {
			try {
				const rows = creatingRecipeIds.map((recipeId) => [newId, recipeId]);
				const placeholders = rows.map(() => '(?, ?)').join(', ');

				await processDb(
					/* sql */ `INSERT INTO articlesRecipes (articleId, recipeId) VALUES ${placeholders}`,
					rows.flat(),
				);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка добавления связей с рецептами:</b> ${error}`);
			}
		}
		if (deletingRecipeIds.length) {
			try {
				const placeholders = deletingRecipeIds.map(() => '?').join(', ');
				await processDb(/* sql */ `DELETE FROM articlesRecipes WHERE articleId = ? AND recipeId IN (${placeholders})`, [
					newId,
					...deletingRecipeIds,
				]);
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка удаления связей с рецептами:</b> ${error}`);
			}
		}

		if (contentImage) {
			try {
				await processImage(contentImage, `${newId}-content`, 'blog');
			} catch (error) {
				errors.push(/* html */ `<b>Ошибка добавления изображения:</b> ${error}`);
			}
		}

		if (errors.length) {
			return getView({
				articleData: {
					content: preparedContent,
					description: preparedDescription,
					published: Boolean(published),
					title: preparedTitle,
				},
				errors,
				id: newId,
			});
		}

		if (published) {
			resetPageCache();
		}
		return { redirect: `/blog/${newId}${published ? '' : '?preview'}` };
	},
};

/** @type {(data: { errors?: string[]; id: number; articleData?: ArticleInForm }) => Promise<RouteData>} */
async function getView({ errors = [], id, articleData }) {
	/** @type {[[ArticleInForm], DbItem[], DbItem[], DbItem[], DbItem[]]} */
	const [[article], articleRecipes, recipes, relatedArticles, articles] = await Promise.all([
		articleData ? [articleData] : processDb(ARTICLE_QUERY, id),
		processDb(ARTICLE_RECIPES_QUERY, id),
		processDb(RECIPES_QUERY, id),
		processDb(RELATED_ARTICLES_QUERY, id),
		processDb(ARTICLES_QUERY),
	]);

	return {
		page: {
			heading: id ? `Редактировать статью № ${id}` : 'Добавить статью',
			pageTemplate: renderArticleForm(
				{
					...article,
					articles,
					id,
					recipeIds: articleRecipes.map(({ id }) => id),
					recipes,
					relatedIds: relatedArticles.map(({ id }) => id),
				},
				errors,
			),
		},
	};
}

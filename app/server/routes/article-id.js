import { renderArticleFooter } from '#common/templates/article-footer.js';
import { renderPageSection } from '#common/templates/page-section.js';
import { isDev } from '#server/constants.js';
import { processDb } from '#server/lib/db.js';

const RECIPES_QUERY = /* sql */ `
	SELECT r.id, r.title FROM recipes r JOIN articlesRecipes ar
	WHERE ar.articleId = ? AND ar.recipeId = r.id
	ORDER BY r.title;
`;

const maxArticleQuery = /* sql */ `SELECT MAX(id) AS length FROM articles`;
const maxArticleQueryWithPublishedOnly = /* sql */ `SELECT MAX(id) AS length FROM articles WHERE published = 1`;

const articlesQuery = getArticlesQuery();
const articlesQueryWithPublishedOnly = getArticlesQuery(/* sql */ `AND published = 1`);

const relatedArticlesQuery = getRelatedArticlesQuery();
const relatedArticlesQueryWithPublishedOnly = getRelatedArticlesQuery(/* sql */ `AND a.published = 1`);

export const articleIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id, isAuthorized, isAmp, body }) {
		const needUnpublished = isDev || (isAuthorized && typeof body.preview !== 'undefined');

		/** @type {[[{ length: number }], [Article], DbItem[], DbItem[]]} */
		const [[{ length }], [article], relatedArticles, recipes] = await Promise.all([
			processDb(needUnpublished ? maxArticleQuery : maxArticleQueryWithPublishedOnly),
			processDb(needUnpublished ? articlesQuery : articlesQueryWithPublishedOnly, id),
			processDb(needUnpublished ? relatedArticlesQuery : relatedArticlesQueryWithPublishedOnly, id),
			processDb(RECIPES_QUERY, id),
		]);

		if (!article) {
			throw new Error('Статья не существует.', { cause: 404 });
		}

		const { content, description, title } = article;
		const imageAlias = `/pictures/blog/${id}`;

		return {
			page: {
				description: description || `Страница содержит статью «${title}».`,
				heading: `${title} | Блог`,
				ogImage: `${imageAlias}@2x.webp`,
				pageTemplate: renderPageSection({
					alt: 'Изображение к статье',
					content,
					footerTemplate: renderArticleFooter({ isAmp, recipes, relatedArticles }),
					imageAlias: `${imageAlias}-content`,
					isAmp,
					next: `/blog/${id === length ? 1 : id + 1}`,
					prev: `/blog/${id === 1 ? length : id - 1}`,
					title,
				}),
			},
		};
	},
};

function getArticlesQuery(queryCondition = '') {
	return /* sql */ `
		SELECT content, description, title FROM articles
		WHERE id = ? ${queryCondition};
	`;
}

function getRelatedArticlesQuery(queryCondition = '') {
	return /* sql */ `
		SELECT a.id, a.title FROM articles a JOIN articlesArticles aa
		WHERE aa.articleId = ? AND aa.relatedArticleId = a.id ${queryCondition}
		ORDER BY a.title;
	`;
}

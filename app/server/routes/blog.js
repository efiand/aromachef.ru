import { renderCards } from '#common/templates/cards.js';
import { isDev } from '#server/constants.js';
import { processDb } from '#server/lib/db.js';

const articlesQuery = /* sql */ `
	SELECT id, title FROM articles
	${isDev ? '' : /* sql */ `WHERE published = 1`}
	ORDER BY title;
`;

export const blogRoute = {
	/** @type {RouteMethod} */
	async GET({ isAmp }) {
		/** @type {DbItem[]} */
		const cards = await processDb(articlesQuery);

		const [{ id: articleId }] = cards;

		return {
			page: {
				description: `Список статей.`,
				heading: 'Блог | Теги',
				ogImage: `/pictures/blog/${articleId}@2x.webp`,
				pageTemplate: /* html */ `
					<h1>Блог</h1>
					${renderCards({ alt: 'Изображение к статье [title]', cards, isAmp, route: '/blog' })}
				`,
			},
		};
	},
};

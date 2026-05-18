import { renderErrorPage } from '#common/templates/error-page.js';

const heading = 'Ошибка 404';

export const notFoundRoute = {
	/** @type {RouteMethod} */
	async GET() {
		return {
			page: {
				description: 'Страница ошибок.',
				heading,
				pageTemplate: renderErrorPage(heading, 'Страница не найдена.'),
			},
		};
	},
};

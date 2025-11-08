import { PROJECT_DESCRIPTION } from "#common/constants.js";
import { renderErrorPage } from "#common/templates/errorPage.js";

const heading = "Сайт обновляется";

export const updateRoute = {
	/** @type {RouteMethod} */
	async GET() {
		return {
			page: {
				description: PROJECT_DESCRIPTION,
				heading,
				pageTemplate: renderErrorPage(heading, "Попробуйте обновить страницу."),
			},
		};
	},
};

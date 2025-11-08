import { renderPageSection } from "#common/templates/page-section.js";
import { processDb } from "#server/lib/db.js";

const sqlQuery = /* sql */ `
	SELECT content, description, title AS heading FROM staticPages WHERE pathname = ?;
`;

export const aboutRoute = {
	/** @type {RouteMethod} */
	async GET({ isAmp }) {
		/** @type {StaticPageData[]} */
		const [{ content, description, heading }] = await processDb(sqlQuery, "/about");

		return {
			page: {
				description,
				heading,
				pageTemplate: renderPageSection({
					articles: [
						{
							content,
							imageAlias: "/images/about",
							isAmp,
						},
					],
					title: heading,
				}),
			},
		};
	},
};

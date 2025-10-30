import { renderPageSection } from "#common/components/page-section.js";
import { sql } from "#common/utils/mark-template.js";
import { processDb } from "#server/lib/db.js";

const sqlQuery = sql`
	SELECT content, description, title AS heading FROM staticPages WHERE pathname = ?;
`;

export const importantRoute = {
	/** @type {RouteMethod} */
	async GET({ isAmp }) {
		/** @type {StaticPageData[]} */
		const [{ content, description, heading }] = await processDb(sqlQuery, "/important");

		return {
			page: {
				description,
				heading,
				pageTemplate: renderPageSection({
					articles: [
						{
							content,
							imageAlias: "/images/important",
							isAmp,
						},
					],
					title: heading,
				}),
			},
		};
	},
};

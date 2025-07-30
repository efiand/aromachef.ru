import { renderPageSection } from "#!/templates/page-section.js";
import { sql } from "#!/utils/mark-template.js";
import { getFromDb } from "#server/lib/db.js";

const sqlQuery = sql`
	SELECT content, description, title AS heading FROM staticPages WHERE pathname = ?;
`;

export const importantRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {StaticPageData[]} */
		const [{ content, description, heading }] = await getFromDb(sqlQuery, "/important");

		return {
			page: {
				description,
				heading,
				pageTemplate: renderPageSection({
					articles: [
						{
							content,
							imageAlias: "/images/important",
						},
					],
					title: heading,
				}),
			},
		};
	},
};

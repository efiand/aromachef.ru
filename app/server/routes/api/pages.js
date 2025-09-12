import { sql } from "#common/utils/mark-template.js";
import { processDb } from "#server/lib/db.js";

const query = sql`
	SELECT CONCAT('/structure/', id) AS url FROM structures s
		WHERE (
			SELECT count(id) FROM recipes WHERE structureId = s.id AND published = 1
		) > 0
	UNION
	SELECT CONCAT('/tag/', id) AS url FROM tags t
		WHERE (
			SELECT count(id) FROM recipes WHERE id IN (
				SELECT recipeId FROM recipesTags WHERE tagId = t.id
			)
			AND published = 1
		) > 0
	UNION
	SELECT CONCAT('/recipe/', id) AS url FROM recipes WHERE published = 1
	UNION
	SELECT pathname AS url FROM staticPages
	ORDER BY LENGTH(url), url;
`;

export const pagesApiRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {{ url: string }[]} */
		const rawPages = await processDb(query);

		/** @type {string[]} */
		const pages = rawPages.map(({ url }) => url);

		pages.push("/", "/search", "/structure");

		return {
			contentType: "application/json",
			template: JSON.stringify(pages),
		};
	},
};

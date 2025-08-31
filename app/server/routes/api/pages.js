import { sql } from "#!/common/utils/mark-template.js";
import { processDb } from "#!/server/lib/db.js";

const query = sql`
	SELECT CONCAT('/structure/', id) AS url FROM structures
	UNION
	SELECT CONCAT('/tag/', id) AS url FROM tags
	UNION
	SELECT CONCAT('/recipe/', id) AS url FROM recipes
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

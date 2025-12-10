import { BASE_URL } from "#common/constants.js";
import { processDb } from "#server/lib/db.js";

const SERVICE_PAGES = ["", "/structure"];

const query = /* sql */ `
	SELECT
		CONCAT('${BASE_URL}/structure/', id) AS loc,
		(
			SELECT DATE_FORMAT(MAX(updatedAt), '%Y-%m-%dT%H:%i:%s+03:00')
			FROM recipes
			WHERE structureId = s.id AND published = 1
		) AS lastmod,
		'0.5' as priority
		FROM structures s
		WHERE (SELECT count(id) FROM recipes WHERE structureId = s.id AND published = 1) > 0
	UNION
	SELECT
		CONCAT('${BASE_URL}/tag/', id) AS loc,
		(
			SELECT DATE_FORMAT(MAX(updatedAt), '%Y-%m-%dT%H:%i:%s+03:00')
			FROM recipes
			WHERE id IN (
				SELECT recipeId FROM recipesTags WHERE tagId = t.id
			) AND published = 1
		) AS lastmod,
		'0.5' as priority
		FROM tags t
		WHERE (
			SELECT count(id) FROM recipes r WHERE id IN (
				SELECT recipeId FROM recipesTags WHERE tagId = t.id
			)
			AND r.published = 1
		) > 0
	UNION
	SELECT
		CONCAT('${BASE_URL}/recipe/', id) AS loc,
		DATE_FORMAT(updatedAt, '%Y-%m-%dT%H:%i:%s+03:00') AS lastmod,
		'1.0' as priority
		FROM recipes
		WHERE published = 1
	UNION
	SELECT
		CONCAT('${BASE_URL}', pathname) AS loc,
		DATE_FORMAT(updatedAt, '%Y-%m-%dT%H:%i:%s+03:00') AS lastmod,
		'0.5' as priority
		FROM staticPages
	ORDER BY lastmod DESC;
`;

/** @type {(lastmod?: string) => Changefreq} */
function getChangefreq(lastmod) {
	if (!lastmod) {
		return undefined;
	}

	const daysAfterMod = Math.floor((Date.now() - new Date(lastmod).valueOf()) / 86_400_000);

	if (daysAfterMod < 1) {
		return "daily";
	}
	if (daysAfterMod < 7) {
		return "weekly";
	}
	if (daysAfterMod < 30) {
		return "monthly";
	}
	if (daysAfterMod < 365) {
		return "yearly";
	}
	return undefined;
}

/** @type {(data: SitemapPage) => string} */
function renderPage({ lastmod, loc, priority }) {
	const changefreq = getChangefreq(lastmod);

	return /* xml */ `
		<url>
			<loc>${loc}</loc>
			${priority ? /* xml */ `<priority>${priority}</priority>` : ""}
			${changefreq ? /* xml */ `<changefreq>${changefreq}</changefreq>` : ""}
			${lastmod ? /* xml */ `<lastmod>${lastmod}</lastmod>` : ""}
		</url>
	`;
}

export const sitemapXmlRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {SitemapPage[]} */
		const pages = await processDb(query);

		/** Дата крайнего обновления */
		const [{ lastmod }] = pages;

		pages.push(...SERVICE_PAGES.map((page) => ({ lastmod, loc: `${BASE_URL}${page}`, priority: "0.8" })));

		return {
			contentType: "application/xml",
			template: /* xml */ `<?xml version="1.0" encoding="UTF-8" ?>
				<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">
					${pages.map(renderPage).join("")}
				</urlset>`,
		};
	},
};

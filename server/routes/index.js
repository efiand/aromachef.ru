import { aboutRoute } from "#server/routes/about.js";
import { importantRoute } from "#server/routes/important.js";
import { mainRoute } from "#server/routes/main.js";
import { pagesApiRoute } from "#server/routes/pages.js";
import { recipeIdRoute } from "#server/routes/recipe-id.js";
import { searchRoute } from "#server/routes/search.js";
import { sitemapXmlRoute } from "#server/routes/sitemap-xml.js";
import { structureRoute } from "#server/routes/structure.js";
import { structureIdRoute } from "#server/routes/structure-id.js";
import { tagIdRoute } from "#server/routes/tag-id.js";
import { turboRssRoute } from "#server/routes/turbo-rss.js";

/** @type {{ [name: string]: Route }} */
export const routes = {
	"/": mainRoute,
	"/about": aboutRoute,
	"/api/pages": pagesApiRoute,
	"/important": importantRoute,
	"/recipe/:id": recipeIdRoute,
	"/search": searchRoute,
	"/sitemap.xml": sitemapXmlRoute,
	"/structure": structureRoute,
	"/structure/:id": structureIdRoute,
	"/tag/:id": tagIdRoute,
	"/turbo.rss": turboRssRoute,
};

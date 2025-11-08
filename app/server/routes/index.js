import { notFoundRoute } from "#server/routes/404.js";
import { aboutRoute } from "#server/routes/about.js";
import { pagesApiRoute } from "#server/routes/api/pages.js";
import { telegramRoute } from "#server/routes/api/telegram.js";
import { importantRoute } from "#server/routes/important.js";
import { mainRoute } from "#server/routes/main.js";
import { recipeIdRoute } from "#server/routes/recipe-id.js";
import { searchRoute } from "#server/routes/search.js";
import { sitemapXmlRoute } from "#server/routes/sitemap-xml.js";
import { structureRoute } from "#server/routes/structure.js";
import { structureIdRoute } from "#server/routes/structure-id.js";
import { tagIdRoute } from "#server/routes/tag-id.js";
import { updateRoute } from "#server/routes/update.js";

/** @type {{ [name: string]: Route }} */
export const routes = {
	"/": mainRoute,
	"/404": notFoundRoute,
	"/about": aboutRoute,
	"/api/pages": pagesApiRoute,
	"/api/telegram": telegramRoute,
	"/important": importantRoute,
	"/recipe/:id": recipeIdRoute,
	"/search": searchRoute,
	"/sitemap.xml": sitemapXmlRoute,
	"/structure": structureRoute,
	"/structure/:id": structureIdRoute,
	"/tag/:id": tagIdRoute,
	"/update": updateRoute,
};

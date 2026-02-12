import { notFoundRoute } from "#server/routes/__/404.js";
import { updateRoute } from "#server/routes/__/update.js";
import { aboutRoute } from "#server/routes/about.js";
import { articleIdAdminRoute } from "#server/routes/admin/article-id.js";
import { authRoute } from "#server/routes/admin/auth.js";
import { commentIdAdminRoute } from "#server/routes/admin/comment-id.js";
import { commentsIdAdminRoute } from "#server/routes/admin/comments-id.js";
import { dumpRoute } from "#server/routes/admin/dump.js";
import { logoutRoute } from "#server/routes/admin/logout.js";
import { adminRoute } from "#server/routes/admin/main.js";
import { recipeIdAdminRoute } from "#server/routes/admin/recipe-id.js";
import { resetCacheRoute } from "#server/routes/admin/reset-cache.js";
import { structuresAdminRoute } from "#server/routes/admin/structures.js";
import { tagsAdminRoute } from "#server/routes/admin/tags.js";
import { pagesApiRoute } from "#server/routes/api/pages.js";
import { telegramRoute } from "#server/routes/api/telegram.js";
import { articleIdRoute } from "#server/routes/article-id.js";
import { commentsIdRoute } from "#server/routes/comments-id.js";
import { importantRoute } from "#server/routes/important.js";
import { mainRoute } from "#server/routes/main.js";
import { recipeIdRoute } from "#server/routes/recipe-id.js";
import { searchRoute } from "#server/routes/search.js";
import { sitemapXmlRoute } from "#server/routes/sitemap-xml.js";
import { structureRoute } from "#server/routes/structure.js";
import { structureIdRoute } from "#server/routes/structure-id.js";
import { tagIdRoute } from "#server/routes/tag-id.js";

/** @type {{ [name: string]: Route }} */
export const routes = {
	"/": mainRoute,
	"/__/404": notFoundRoute,
	"/__/update": updateRoute,
	"/about": aboutRoute,
	"/admin": adminRoute,
	"/admin/auth": authRoute,
	"/admin/blog/:id": articleIdAdminRoute,
	"/admin/comment/:id": commentIdAdminRoute,
	"/admin/comments/:id": commentsIdAdminRoute,
	"/admin/dump": dumpRoute,
	"/admin/logout": logoutRoute,
	"/admin/recipe/:id": recipeIdAdminRoute,
	"/admin/reset-cache": resetCacheRoute,
	"/admin/structures": structuresAdminRoute,
	"/admin/tags": tagsAdminRoute,
	"/api/pages": pagesApiRoute,
	"/api/telegram": telegramRoute,
	"/blog/:id": articleIdRoute,
	"/comments/:id": commentsIdRoute,
	"/important": importantRoute,
	"/recipe/:id": recipeIdRoute,
	"/search": searchRoute,
	"/sitemap.xml": sitemapXmlRoute,
	"/structure": structureRoute,
	"/structure/:id": structureIdRoute,
	"/tag/:id": tagIdRoute,
};

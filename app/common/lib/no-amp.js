import { STATIC_PAGES } from "#common/constants.js";

const noAmpRoutes = ["/admin", "/api", "/search", "/sitemap.xml", ...STATIC_PAGES];

export function noAmp(pathname = "") {
	return noAmpRoutes.some((item) => pathname.startsWith(item));
}

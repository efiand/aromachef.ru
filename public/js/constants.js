export const BASE_URL = "https://aromachef.ru";

export const PROJECT_TITLE = "АромаШеф";

export const PROJECT_DESCRIPTION = "Быстрые, вкусные и полезные рецепты с эфирными маслами.";

/** @type {Record<string, string>} */
export const STATIC_MIME_TYPES = {
	".js": "application/javascript",
	".css": "text/css",
	".html": "text/html",
	".png": "image/png",
	".ico": "image/x-icon",
	".svg": "image/svg+xml",
	".txt": "plain/text",
	".webmanifest": "application/json",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

/** @type {Set<string>} */
export const staticExtensions = new Set(Object.keys(STATIC_MIME_TYPES));

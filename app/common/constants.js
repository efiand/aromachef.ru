export const BASE_URL = "https://aromachef.ru";

export const PROJECT_TITLE = "АромаШеф";

export const PROJECT_DESCRIPTION = "Быстрые, вкусные и полезные рецепты с эфирными маслами.";

export const version = {
	CSS: 6,
	JS: 1,
};

/** @type {Record<string, string>} */
export const STATIC_MIME_TYPES = {
	".avif": "image/avif",
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".ico": "image/x-icon",
	".js": "application/javascript; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml; charset=utf-8",
	".txt": "plain/text; charset=utf-8",
	".webmanifest": "application/json; charset=utf-8",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

/** @type {Set<string>} */
export const staticExtensions = new Set(Object.keys(STATIC_MIME_TYPES));

export const BASE_URL = "https://aromachef.ru";

export const PROJECT_TITLE = "АромаШеф";

export const PROJECT_DESCRIPTION = "Быстрые, вкусные и полезные рецепты с эфирными маслами.";

/** @type {Record<string, string>} */
export const STATIC_MIME_TYPES = {
	".js": "application/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".png": "image/png",
	".ico": "image/x-icon",
	".svg": "image/svg+xml; charset=utf-8",
	".txt": "plain/text; charset=utf-8",
	".webmanifest": "application/json; charset=utf-8",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

/** @type {Set<string>} */
export const staticExtensions = new Set(Object.keys(STATIC_MIME_TYPES));

/** @type {Stylesheet[]} */
export const ALL_STYLESHEETS = [
	{
		name: "common",
	},
	{
		name: "hover",
		media: "(hover: hover)",
	},
	{
		name: "motion",
		media: "(prefers-reduced-motion: no-preference)",
	},
	{
		name: "385-",
		media: "(max-width: 385px)",
	},
	{
		name: "887-",
		media: "(max-width: 887px)",
	},
	{
		name: "480+",
		media: "(min-width: 480px)",
	},
	{
		name: "888+",
		media: "(min-width: 888px)",
	},
	{
		name: "1280+",
		media: "(min-width: 1280px)",
	},
];

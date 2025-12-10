/** @type {Record<string, string>} */
let cache = {};

/** @type {Record<string, string>} */
let fragmentCache = {};

/** @type {(url: string, useFragment?: boolean) => string} */
export function getPageFromCache(url, useFragment = false) {
	return (useFragment ? fragmentCache : cache)[url] || "";
}

/** @type {(url: string, html: string, useFragment?: boolean) => void} */
export function recordPagesCache(url, html, useFragment = false) {
	(useFragment ? fragmentCache : cache)[url] = html;
}

export function resetPageCache() {
	cache = {};
	fragmentCache = {};
}

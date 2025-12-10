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

/** @type {(prefix?: string) => void} */
export function resetPageCache(prefix) {
	if (prefix) {
		Object.keys(cache).forEach((key) => {
			if (key.startsWith(prefix)) {
				delete cache[key];
			}
		});
		Object.keys(fragmentCache).forEach((key) => {
			if (key.startsWith(prefix)) {
				delete fragmentCache[key];
			}
		});
	} else {
		cache = {};
		fragmentCache = {};
	}
}

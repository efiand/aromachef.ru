/** @type {Record<string, PageCache>} */
let cache = {};

/** @type {Record<string, PageCache>} */
let fragmentCache = {};

/** @type {(url: string, useFragment?: boolean) => PageCache | null} */
export function getPageFromCache(url, useFragment = false) {
	return (useFragment ? fragmentCache : cache)[url] || null;
}

/** @type {(url: string, data: PageCache, useFragment?: boolean) => void} */
export function recordPagesCache(url, data, useFragment = false) {
	(useFragment ? fragmentCache : cache)[url] = data;
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

import { dir } from "#client/constants.js";
import { version } from "#common/constants.js";

/** @type {Map<string, Promise<HTMLScriptElement>>} */
const cache = new Map();

/**
 * Загружает скрипт по URL только один раз.
 * Возвращает Promise, который резолвится, когда скрипт готов.
 * @type {(src: string, options?: { async?: boolean; defer?: boolean; type?: string }) => Promise<HTMLScriptElement>}
 */
export function loadScript(src, { async = true, defer = true, type = "" } = {}) {
	// Если уже загружали — вернуть тот же промис
	if (cache.has(src)) {
		const promise = cache.get(src);
		if (promise) {
			return promise;
		}
	}

	const promise = new Promise((resolve, reject) => {
		const element = document.createElement("script");

		element.src = src;
		element.async = async;
		element.defer = defer;
		if (type) {
			element.type = type;
		}

		element.onload = () => resolve(element);
		element.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${src}`));

		document.head.appendChild(element);
	});

	cache.set(src, promise);
	return promise;
}

/** @type {(entryName: string) => Promise<HTMLScriptElement>} */
export async function loadScriptEntry(entryName) {
	const fileName = `${dir.JS}/${entryName}.js`;

	if (window.isDev) {
		return await loadScript(fileName, { type: "module" });
	}
	return await loadScript(`${fileName}?v${version.JS}`);
}

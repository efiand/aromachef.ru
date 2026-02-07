import { YANDEX_METRIKA_ID } from "#common/constants.js";

window.__metrikaHitsQueue = [];

/**
 * Отправляет виртуальный pageview в Яндекс.Метрику (SPA)
 *
 * @param {string} url - Относительный или абсолютный URL страницы
 * @param {string} title - Заголовок страницы
 * @returns {void}
 */
export function trackPageView(url, title) {
	if (typeof window === "undefined") {
		return;
	}

	if (typeof window.ym !== "function") {
		window.__metrikaHitsQueue?.push({ title, url });
		return;
	}

	window.ym(YANDEX_METRIKA_ID, "hit", url, {
		referer: document.referrer,
		title,
	});
}

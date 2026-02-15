import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import Typograf from "typograf";
import { minifyHtml } from "#server/lib/minify-html.js";

const purifyConfig = { ADD_ATTR: ["target", "rel"] };

const { window } = new JSDOM("");
const { document } = window;
const purify = DOMPurify(window);
// @ts-expect-error
const typograf = new Typograf({ locale: ["ru", "en-US"] });

purify.addHook("afterSanitizeAttributes", (node) => {
	if (node.nodeName === "A" && node.getAttribute("target") === "_blank") {
		if (!node.hasAttribute("rel")) {
			node.setAttribute("rel", "noopener noreferrer");
		}
	}
});

// Отключаем перенос кавычек вокруг ссылок
typograf.disableRule("common/punctuation/quoteLink");

/** @type {(html: string, clearTags?: boolean) => string} */
export function prepareText(html, clearTags = false) {
	let text = "";
	if (clearTags) {
		/** @type {HTMLDivElement} */
		const element = document.createElement("div");

		element.innerHTML = html;
		text = element.textContent || "";
	} else {
		text = purify.sanitize(html, purifyConfig);
	}

	return typograf.execute(text).trim();
}

/** @type {(html: string, clearTags?: boolean) => Promise<string>} */
export async function prepareAndMinifyHtml(html, clearTags = false) {
	return await minifyHtml(prepareText(html, clearTags), { removeAttributeQuotes: false });
}

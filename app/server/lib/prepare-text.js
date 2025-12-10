import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import Typograf from "typograf";
import { minifyHtml } from "#server/lib/minify-html.js";

const { window } = new JSDOM("");
const { document } = window;
const purify = DOMPurify(window);

// @ts-expect-error
const typograf = new Typograf({ locale: ["ru", "en-US"] });

/** @type {(html: string, clearTags?: boolean) => string} */
export function prepareText(html, clearTags = false) {
	let text = "";
	if (clearTags) {
		/** @type {HTMLDivElement} */
		const element = document.createElement("div");

		element.innerHTML = html;
		text = element.textContent || "";
	} else {
		text = purify.sanitize(html);
	}

	return typograf.execute(text).trim();
}

/** @type {(html: string, clearTags?: boolean) => Promise<string>} */
export async function prepareAndMinifyHtml(html, clearTags = false) {
	return await minifyHtml(prepareText(html, clearTags), { removeAttributeQuotes: false });
}

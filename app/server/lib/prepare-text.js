import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import Typograf from "typograf";

const { window } = new JSDOM("");
const { document } = window;
// @ts-expect-error
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

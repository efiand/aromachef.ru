import { dir } from "#client/constants.js";
import { version } from "#common/constants.js";
import { html } from "#common/utils/mark-template.js";

/** @type {(name: string) => void} */
export function loadCss(url) {
	const href = `href="${url}"`;

	if (!document.head.querySelector(`[${href}]`)) {
		document.head.insertAdjacentHTML("beforeend", html`<link rel="stylesheet" ${href}>`);
	}
}

export function setScrollbarWidth() {
	document.body.style.setProperty("--scrollbar-width", `${window.innerWidth - document.documentElement.clientWidth}px`);
}

/** @type {(entryName: string) => void} */
export function loadCssEntry(entryName) {
	if (window.isDev) {
		return loadCss(`${dir.CSS}/${entryName}.css`);
	}
	return loadCss(`${dir.CSS}/${entryName}.css?v${version.CSS}`);
}

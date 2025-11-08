import { dir } from "#client/constants.js";
import { version } from "#common/constants.js";

/** @type {(name: string) => void} */
export function loadCss(url) {
	const href = `href="${url}"`;

	if (!document.head.querySelector(`[${href}]`)) {
		document.head.insertAdjacentHTML("beforeend", /* html */ `<link rel="stylesheet" ${href}>`);
	}
}

/** @type {(entryName: string) => void} */
export function loadCssEntry(entryName) {
	if (window.isDev) {
		return loadCss(`${dir.CSS}/${entryName}.css`);
	}
	return loadCss(`${dir.CSS}/${entryName}.css?v${version.CSS}`);
}

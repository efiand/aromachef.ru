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

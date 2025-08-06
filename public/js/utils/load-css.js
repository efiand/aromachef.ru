import { html } from "#!/utils/mark-template.js";

/** @type {(name: string) => void} */
export function loadCss(name) {
	const url = `/css/${name}`;

	if (!document.head.querySelector(`[href="${url}"]`)) {
		document.head.insertAdjacentHTML("beforeend", html`<link rel="stylesheet" href="${url}">`);
	}
}

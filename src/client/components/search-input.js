import { getElement } from "#client/lib/get-element.js";

/** @type {ComponentInitiator} */
export function initSearchInput(element) {
	getElement("button", element).addEventListener("click", reset);
}

/** @param {PointerEvent} event */
function reset({ target }) {
	if (target instanceof HTMLButtonElement && target.previousElementSibling instanceof HTMLInputElement) {
		target.previousElementSibling.value = "";
		target.previousElementSibling.focus();
		target.dispatchEvent(new CustomEvent("clear-search", { bubbles: true }));
	}
}

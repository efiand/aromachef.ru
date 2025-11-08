/** @type {(selector: string, parentElement?: HTMLElement) => HTMLElement} */
export function getElement(selector, parentElement = document.body) {
	return /** @type {NonNullable<HTMLElement>} */ (parentElement.querySelector(selector));
}

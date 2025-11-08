/** @type {(selector: string, initItem: ComponentInitiator) => void} */
export function init(selector, initItem) {
	/** @type {NodeListOf<HTMLElement>} */
	const elements = document.querySelectorAll(selector);

	elements.forEach(initItem);
}

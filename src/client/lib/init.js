/** @type {(selector: string, initItem: ComponentInitiator) => void} */
export function init(selector, initItem) {
	/** @type {NodeListOf<HTMLElement>} */
	const elements = document.querySelectorAll(selector);

	elements.forEach(initItem);
}

/** @param {Record<string, ComponentInitiator>} dict */
export function initComponents(dict) {
	Object.entries(dict).forEach(([name, initComponent]) => {
		init(`[data-component="${name}"]`, initComponent);
	});
}

export function renderFromTemplate(template = '') {
	const wrapperElement = document.createElement('div');
	wrapperElement.innerHTML = template;
	return /** @type {NonNullable<HTMLElement>} */ (wrapperElement.firstElementChild);
}

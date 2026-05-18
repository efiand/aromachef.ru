/** @type {ComponentInitiator} */
export function initSearchInput(element) {
	if (element.dataset.ready) {
		// На случай инициализации при клиентском рендеринге из более крупного компонента
		return;
	}

	const buttonElement = /** @type {HTMLButtonElement} */ (element.querySelector('button'));
	const inputElement = /** @type {HTMLInputElement} */ (element.querySelector('input'));

	buttonElement.addEventListener('click', () => {
		inputElement.value = '';
		inputElement.focus();
		buttonElement.dispatchEvent(new CustomEvent('clear-search', { bubbles: true }));
	});

	element.dataset.ready = '';
}

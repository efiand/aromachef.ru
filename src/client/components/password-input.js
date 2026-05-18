/** @type {ComponentInitiator} */
export function initPasswordInput(element) {
	const buttonElement = /** @type {HTMLButtonElement} */ (element.querySelector('button'));
	const inputElement = /** @type {HTMLInputElement} */ (element.querySelector('input'));

	buttonElement.addEventListener('click', () => {
		inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
		inputElement.focus();
		buttonElement.classList.toggle('password-input__button--shown');
	});
}

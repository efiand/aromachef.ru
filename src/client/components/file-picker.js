/** @type {ComponentInitiator} */
export function initFilePicker(element) {
	const inputElement = /** @type {HTMLInputElement} */ (element.querySelector(`[type="file"]`));

	inputElement.addEventListener('change', () => {
		const file = inputElement.files?.[0];
		element.style.backgroundImage = file ? `url("${URL.createObjectURL(file)}")` : 'none';
	});
}

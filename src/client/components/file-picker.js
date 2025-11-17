import { getElement } from "#client/lib/get-element.js";

/** @type {ComponentInitiator} */
export function initFilePicker(element) {
	const inputElement = /** @type {HTMLInputElement} */ (getElement("input", element));

	inputElement.addEventListener("change", () => {
		const file = inputElement.files?.[0];
		element.style.backgroundImage = file ? `url("${URL.createObjectURL(file)}")` : "none";
	});
}

import { getElement } from "#client/lib/get-element.js";

/** @type {ComponentInitiator} */
export function initPasswordInput(element) {
	const buttonElement = /** @type {HTMLButtonElement} */ (getElement("button", element));
	const inputElement = /** @type {HTMLInputElement} */ (getElement("input", element));

	buttonElement.addEventListener("click", () => {
		inputElement.type = inputElement.type === "password" ? "text" : "password";
		inputElement.focus();
		buttonElement.classList.toggle("password-input__button--shown");
	});
}

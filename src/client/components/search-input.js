/** @type {ComponentInitiator} */
export function initSearchInput(element) {
	const buttonElement = /** @type {HTMLButtonElement} */ (element.querySelector("button"));
	const inputElement = /** @type {HTMLInputElement} */ (element.querySelector("input"));

	buttonElement.addEventListener("click", () => {
		inputElement.value = "";
		inputElement.focus();
		buttonElement.dispatchEvent(new CustomEvent("clear-search", { bubbles: true }));
	});
}

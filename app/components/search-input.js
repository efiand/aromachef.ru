import { html } from "#common/utils/mark-template.js";
import { NonNull } from "#common/utils/non-null.js";

const BUTTON_TEMPLATE = html`<button class="search-input__button" type="reset" aria-label="Очистить"></button>`;

/** @type {ComponentInitiator} */
export function initSearchInput(rootElement) {
	/** @type {!HTMLInputElement} */
	const inputElement = NonNull(rootElement.querySelector("input"));

	inputElement.classList.add("search-input__input");
	inputElement.autocomplete = "off";
	inputElement.placeholder = inputElement.ariaLabel || "Введите запрос";

	rootElement.insertAdjacentHTML("beforeend", BUTTON_TEMPLATE);

	// Если изначальное значение было, то ресет кастомный
	if (inputElement.value) {
		rootElement.querySelector("button")?.addEventListener("click", (event) => {
			event.preventDefault();
			inputElement.value = "";
		});
	}

	rootElement.dataset.ready = "";
}

import { html } from "#!/utils/mark-template.js";

let installed = false;

const CSS_TEMPLATE = html`<link rel="stylesheet" href="/css/components/search-input.css">`;
const BUTTON_TEMPLATE = html`<button class="search-input__button" type="reset" aria-label="Очистить"></button>`;

/** @type {ComponentInitiator} */
export const initSearchInput = (rootElement) => {
	const inputElement = rootElement.querySelector("input");
	if (!inputElement) {
		return;
	}

	if (!installed) {
		document.head.insertAdjacentHTML("beforeend", CSS_TEMPLATE);
		installed = true;
	}

	inputElement.classList.add("search-input__input");
	inputElement.placeholder = inputElement.ariaLabel || "Введите запрос";

	rootElement.insertAdjacentHTML("beforeend", BUTTON_TEMPLATE);

	// Если изначальное значение было, то ресет кастомный
	if (inputElement.value) {
		rootElement.querySelector("button")?.addEventListener("click", (event) => {
			event.preventDefault();
			inputElement.value = "";
		});
	}
};

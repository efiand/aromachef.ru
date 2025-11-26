import { openModal } from "#client/components/modal.js";
import { initSearchInput } from "#client/components/search-input.js";
import { debounce } from "#client/lib/debounce.js";
import { renderSearchInput } from "#common/templates/search-input.js";

/** @type {HTMLDivElement | null} */
let asyncSearchElement = null;

/** @type {HTMLDivElement | null} */
let resultElement = null;

function createElements() {
	asyncSearchElement = document.createElement("div");
	asyncSearchElement.classList.add("async-search");
	asyncSearchElement.innerHTML = renderSearchInput("", true);
	asyncSearchElement.addEventListener("clear-search", onClear);

	const searchInputElement = /** @type {HTMLInputElement} */ (asyncSearchElement.querySelector("[data-search-input]"));
	initSearchInput(searchInputElement);
	searchInputElement.querySelector("input")?.addEventListener("input", onInput);

	resultElement = document.createElement("div");
	resultElement.classList.add("async-search__result");

	asyncSearchElement.append(resultElement);
}

function onClear() {
	if (resultElement) {
		resultElement.innerHTML = "";
	}
}

const onInput = debounce(
	/** @param {InputEvent} event */
	async ({ target }) => {
		if (target instanceof HTMLInputElement && resultElement) {
			const text = target.value.trim();
			if (text.length >= 3) {
				const results = await fetch(`/search?q=${text}&limit=4&fragment`).then((res) => res.text());
				resultElement.innerHTML = results;
			}
		}
	},
);

/** @type {(openElement: HTMLElement) => void} */
export function initAsyncSearch(openerElement) {
	openerElement.addEventListener("click", (event) => {
		if (event.ctrlKey) {
			return;
		}
		event.preventDefault();

		if (!asyncSearchElement) {
			createElements();
		}
		if (asyncSearchElement) {
			openModal(asyncSearchElement, true);
			asyncSearchElement.querySelector("input")?.focus();
		}
	});
}

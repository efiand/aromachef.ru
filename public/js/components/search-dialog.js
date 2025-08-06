import { openDialog } from "#!/components/dialog.js";
import { initSearchInput } from "#!/components/search-input.js";
import { debounce } from "#!/utils/debounce.js";
import { loadCss } from "#!/utils/load-css.js";
import { html } from "#!/utils/mark-template.js";
import { NonNull } from "#!/utils/non-null.js";

const TEMPLATE = html`
	<div class="search-input">
		<input class="search-input__input" type="search" name="q" aria-label="Поиск рецептов">
	</div>

	<div class="search-dialog__result"></div>
`;

/** @type {(openElement: HTMLElement) => void} */
export function initSearchDialog(openElement) {
	loadCss("components/search-dialog.css");

	const formElement = document.createElement("form");
	formElement.className = "search-dialog";
	formElement.action = "/search";
	formElement.innerHTML = TEMPLATE;

	/** @type {HTMLDivElement} */
	const wrapperElement = NonNull(formElement.querySelector(".search-input"));

	/** @type {HTMLDivElement} */
	const resultElement = NonNull(formElement.querySelector(".search-dialog__result"));

	/** @type {HTMLInputElement} */
	const inputElement = NonNull(wrapperElement.querySelector("input"));

	initSearchInput(wrapperElement);
	inputElement.addEventListener(
		"input",
		debounce(async () => {
			if (inputElement.value.length < 3) {
				return;
			}
			const template = await fetch(`/search?q=${inputElement.value}&limit=4&fragment`).then((res) => res.text());
			resultElement.innerHTML = template;
		}),
	);

	openElement.addEventListener("click", (event) => {
		if (event.ctrlKey) {
			return;
		}
		event.preventDefault();
		openDialog(formElement);
	});
}

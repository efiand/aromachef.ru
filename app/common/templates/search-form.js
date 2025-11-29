import { renderSearchInput } from "#common/templates/search-input.js";

/** @type {(data: { nof?: number; value?: string | null }) => string} */
export function renderSearchForm({ nof, value } = {}) {
	return /* html */ `
		<form class="search-form" action="/search" target="_top">
			${renderSearchInput(value || "")}
			<button class="button" type="submit" data-component="submitter">Найти</button>
			${typeof nof === "number" ? /* html */ `<p class="search-form__nof">Найдено: ${nof}</p>` : ""}
		</form>
	`;
}

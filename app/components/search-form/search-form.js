import { html } from "#!/common/utils/mark-template.js";

/** @type {(data: { nof?: number; value?: string | null }) => string} */
export function renderSearchForm({ nof, value } = {}) {
	return html`
		<form class="search-form" action="/search" target="_top">
			<div class="search-input">
				<input class="search-input__input" type="search" name="q" value="${value || ""}" aria-label="Введите запрос">
			</div>
			<button class="button" type="submit">Найти</button>
			${typeof nof === "number" ? html`<p class="search-form__nof">Найдено: ${nof}</p>` : ""}
		</form>
	`;
}

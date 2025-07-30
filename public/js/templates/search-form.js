import { html } from "#!/utils/mark-template.js";

/** @type {(data: { nof?: number; value?: string | null }) => string} */
export function renderSearchForm({ nof, value } = {}) {
	return html`
		<form class="search-form">
			<input type="search" name="q" value="${value || ""}">
			<button class="button" type="submit">Найти</button>
			${typeof nof === "number" ? html`<p class="search-form__nof">Найдено: ${nof}</p>` : ""}
		</form>
	`;
}

import { html } from "#!/utils/mark-template.js";

/** @type {(tag: DbItem) => string} */
function renderTag({ id, title }) {
	return html`
		<li class="tags__item">
			<a class="tags__link" href="/tag/${id}">#${title}</a>
		</li>
	`;
}

/**
 * Генерирует HTML-шаблон списка тегов
 *
 * @type {(data: TagTemplateData) => string}
 */
export function renderTags({ className = "", column = false, tags }) {
	const modifier = column ? "tags--column" : "";

	return html`
		<ul class="tags ${modifier} ${className}">
			${tags.map(renderTag).join("")}
		</ul>
	`;
}

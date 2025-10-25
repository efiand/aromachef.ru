import { html } from "#common/utils/mark-template.js";

/** @type {(structure: DbItem) => string} */
function renderStructure({ current, id, title }) {
	return html`
		<li class="structures__item">
			<a class="structures__link" href="/structure/${id}" ${current ? 'aria-current="page"' : ""}>
				${title}
			</a>
		</li>
	`;
}

/**
 * Генерирует HTML-шаблон списка тегов
 *
 * @type {(data: { className?: string; structures: DbItem[] }) => string}
 */
export function renderStructures({ className = "", structures }) {
	return html`
		<ul class="structures ${className}">
			${structures.map(renderStructure).join("")}
		</ul>
	`;
}

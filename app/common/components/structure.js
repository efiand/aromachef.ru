import { renderCards } from "#common/components/cards.js";
import { renderStructures } from "#common/components/structures.js";
import { renderTags } from "#common/components/tags.js";
import { html } from "#common/utils/mark-template.js";

/**
 * Генерирует HTML-шаблон списка карточек с боковым меню
 *
 * @type {(data: StructureData) => string}
 */
export function renderStructure({
	alt = "",
	asideHeading,
	asideId = "",
	cards,
	heading,
	route = "/recipe",
	structures = [],
	tags = [],
}) {
	let asideTemplate = "";
	if (tags.length) {
		asideTemplate = renderTags({ className: "structure__menu", column: true, tags });
	} else if (structures.length) {
		asideTemplate = renderStructures({ className: "structure__menu", structures });
	}

	const id = asideId ? `id="${asideId}"` : "";

	return html`
		<section class="structure">
			<div>
				<h1 class="structure__heading">${heading}</h1>
				${renderCards({ alt, cards, route })}
			</div>

			<div class="structure__aside" ${id}>
				<h2 class="structure__asideheading">${asideHeading}</h2>
				${asideTemplate}
			</div>
		</section>
	`;
}

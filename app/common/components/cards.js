import { html } from "#common/utils/mark-template.js";

/** @type {(data: DbItem & CardAdditionals) => string} */
function renderCard({ alt = "", id, route, title }) {
	const url = `${route}/${id}`;

	return html`
		<li class="cards__item">
			<a href="${url}">
				<img
					class="image"
					src="/pictures${url}@1x.webp"
					srcset="/pictures${url}@2x.webp 2x"
					width="272"
					height="204"
					alt="${alt.replace("[title]", `«${title}»`)}"
					loading="lazy"
				>
				<span>${title}</span>
			</a>
		</li>
	`;
}

/**
 * Генерирует HTML-шаблон списка карточек
 *
 * @type {(data?: CardsData) => string}
 */
export function renderCards({ alt = "", cards = [], className = "", route = "/recipe" } = {}) {
	const cardsTemplate = cards.map((card) => renderCard({ ...card, alt, route })).join("");

	return html`<ul class="cards ${className}">${cardsTemplate}</ul>`;
}

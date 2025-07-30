import { html } from "#!/utils/mark-template.js";

/** @type {(data: DbItem & CardAdditionals) => string} */
function renderCard({ alt, id, picturesHost, route, title }) {
	const url = `${route}/${id}`;

	return html`
		<li class="cards__item">
			<a href="${url}">
				<img
					class="image"
					src="${picturesHost}/pictures${url}@1x.webp"
					srcset="${picturesHost}/pictures${url}@2x.webp 2x"
					width="272"
					height="204"
					alt="${alt}"
					loading="lazy"
				>
			</a>
			<a href="${url}">${title}</a>
		</li>
	`;
}

/**
 * Генерирует HTML-шаблон списка карточек
 *
 * @type {(data?: CardsData) => string}
 */
export function renderCards({ alt = "", centered = true, cards = [], picturesHost = "", route = "/recipe" } = {}) {
	const modifier = centered ? "cards--centered" : "cards--centered-in-mobile";
	const cardsTemplates = cards.map((card) => renderCard({ ...card, alt, picturesHost, route }));

	return html`
		<ul class="cards ${modifier}">
			${cardsTemplates.join("")}
		</ul>
	`;
}

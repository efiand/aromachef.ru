import { html } from "#!/utils/mark-template.js";

/** @type {(data: DbItem & CardAdditionals) => string} */
function renderCard({ alt = "", id, picturesHost, route, title }) {
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
export function renderCards({
	alt = "",
	centered = true,
	cards = [],
	className = "",
	picturesHost = "",
	route = "/recipe",
} = {}) {
	const modifier = centered ? "cards--centered" : "cards--centered-in-mobile";
	const cardsTemplate = cards.map((card) => renderCard({ ...card, alt, picturesHost, route })).join("");

	return html`<ul class="cards ${modifier} ${className}">${cardsTemplate}</ul>`;
}

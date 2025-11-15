import { renderImage } from "#common/templates/image.js";

/** @type {(data: DbItem & CardAdditionals) => string} */
function renderCard({ alt = "", id, isAmp, route, title }) {
	const url = `${route}/${id}`;
	const imageAlias = `/pictures${url}`;

	return /* html */ `
		<li class="cards__item">
			<a href="${url}">
				${renderImage({
					alt: alt.replace("[title]", `«${title}»`),
					height: 204,
					imageAlias,
					isAmp,
					width: 272,
				})}
				<span>${title}</span>
			</a>
		</li>
	`;
}

/**
 * Генерирует HTML-шаблон списка карточек
 * @type {(data?: CardsData) => string}
 */
export function renderCards({
	alt = "На фото изображено готовое блюдо [title] в миниатюре.",
	cards = [],
	className = "",
	isAmp,
	route = "/recipe",
} = {}) {
	const cardsTemplate = cards.map((card) => renderCard({ ...card, alt, isAmp, route })).join("");

	return /* html */ `<ul class="cards ${className}">${cardsTemplate}</ul>`;
}

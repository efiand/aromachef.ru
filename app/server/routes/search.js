import { renderCards } from "#common/templates/cards.js";
import { renderPageSection } from "#common/templates/page-section.js";
import { renderSearchForm } from "#common/templates/search-form.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";

const recipesQuery = /* sql */ `
	SELECT
		id,
		REPLACE(title, ?, CONCAT('<mark>', ?, '</mark>')) as title
	FROM recipes WHERE
		(LOWER(title) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(description) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(ingredients) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(ingredientsExtra) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(cooking) LIKE CONCAT('%', LOWER(?), '%'))
		${isDev ? "" : /* sql */ `AND published = 1`}
	ORDER BY title;
`;

/** @type {(cards: DbItem[], isAmp: boolean) => string} */
function getCardsTemplate(cards, isAmp) {
	if (!cards.length) {
		return "";
	}

	return renderCards({
		alt: "На фото изображено готовое блюдо [title] в миниатюре.",
		cards,
		isAmp,
	});
}

export const searchRoute = {
	/** @type {RouteMethod} */
	async GET({ body, isAmp }) {
		const pattern = (body.q || "").trim();

		/** @type {DbItem[]} */
		let cards = [];
		if (pattern) {
			cards = await processDb(recipesQuery, pattern);
		}

		const nof = pattern ? cards.length : undefined;

		if (body.fragment !== undefined) {
			const cardsTemplate = nof ? getCardsTemplate(cards.slice(0, 4), isAmp) : /* html */ `<p>Ничего не найдено.</p>`;
			const buttonTemplate =
				nof && nof > 4
					? /* html */ `<a class="button" href="/search?q=${pattern}" data-goto>Все результаты (${nof})</a>`
					: "";
			return {
				template: cardsTemplate + buttonTemplate,
			};
		}

		return {
			page: {
				description: "Ищите рецепты по заголовкам и содержимому.",
				heading: "Поиск рецептов",
				pageTemplate: renderPageSection({
					footerTemplate: renderSearchForm({ nof, value: pattern }) + (pattern ? getCardsTemplate(cards, isAmp) : ""),
					title: "Поиск рецептов",
				}),
			},
		};
	},
};

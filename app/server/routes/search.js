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

export const searchRoute = {
	/** @type {RouteMethod} */
	async GET({ body, isAmp }) {
		const { q = "" } = /** @type {{ q?: string; }} */ (body);
		const pattern = q.trim();

		/** @type {DbItem[]} */
		let cards = [];
		if (pattern) {
			cards = await processDb(recipesQuery, pattern);
		}

		const nof = pattern ? cards.length : undefined;

		if (body.fragment !== undefined) {
			const cardsTemplate = nof
				? renderCards({ cards: cards.slice(0, 4), isAmp })
				: /* html */ `<p>Ничего не найдено.</p>`;
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
					footerTemplate: renderSearchForm({ nof, value: pattern }) + (nof ? renderCards({ cards, isAmp }) : ""),
					title: "Поиск рецептов",
				}),
			},
		};
	},
};

import { html, sql } from "#!/common/utils/mark-template.js";
import { renderCards } from "#!/components/cards/cards.js";
import { renderPageSection } from "#!/components/page-section/page-section.js";
import { renderSearchForm } from "#!/components/search-form/search-form.js";
import { isDev } from "#!/server/constants.js";
import { processDb } from "#!/server/lib/db.js";

const recipesQuery = sql`
	SELECT
		id,
		REPLACE(title, ?, CONCAT('<mark>', ?, '</mark>')) as title
	FROM recipes WHERE
		(LOWER(title) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(description) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(ingredients) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(cooking) LIKE CONCAT('%', LOWER(?), '%'))
		${isDev ? "" : sql`AND published = 1`}
	ORDER BY title;
`;

/** @type {(cards: DbItem[]) => string} */
function getCardsTemplate(cards) {
	if (!cards.length) {
		return "";
	}

	return renderCards({
		alt: "На фото изображено готовое блюдо [title] в миниатюре.",
		cards,
		centered: false,
	});
}

export const searchRoute = {
	/** @type {RouteMethod} */
	async GET({ body }) {
		const pattern = (body.q || "").trim();

		/** @type {DbItem[]} */
		let cards = [];
		if (pattern) {
			cards = await processDb(recipesQuery, pattern);
		}

		const nof = pattern ? cards.length : undefined;

		if (body.fragment !== undefined) {
			const cardsTemplate = nof ? getCardsTemplate(cards.slice(0, 4)) : html`<p>Ничего не найдено.</p>`;
			const buttonTemplate =
				nof && nof > 4 ? html`<button class="button" type="submit">Все результаты (${nof})</button>` : "";
			return {
				template: cardsTemplate + buttonTemplate,
			};
		}

		return {
			page: {
				description: "Ищите рецепты по заголовкам и содержимому.",
				heading: "Поиск рецептов",
				pageTemplate: renderPageSection({
					footerTemplate: renderSearchForm({ nof, value: pattern }) + (pattern ? getCardsTemplate(cards) : ""),
					title: "Поиск рецептов",
				}),
			},
		};
	},
};

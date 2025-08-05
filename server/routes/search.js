import { renderCards } from "#!/templates/cards.js";
import { renderPageSection } from "#!/templates/page-section.js";
import { renderSearchForm } from "#!/templates/search-form.js";
import { sql } from "#!/utils/mark-template.js";
import { isDev, picturesHost } from "#server/constants.js";
import { getFromDb } from "#server/lib/db.js";

const recipesQuery = sql`
	SELECT
		id,
		REPLACE(title, ?, CONCAT('<mark>', ?, '</mark>')) as title
	FROM recipes WHERE
		LOWER(title) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(description) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(ingredients) LIKE CONCAT('%', LOWER(?), '%')
		OR LOWER(cooking) LIKE CONCAT('%', LOWER(?), '%')
		${isDev ? "" : sql`AND published = 1`}
	ORDER BY title;
`;

export const searchRoute = {
	/** @type {RouteMethod} */
	async GET({ url }) {
		const searchPlaceholder = url.searchParams.get("q");

		/** @type {DbItem[]} */
		const cards = searchPlaceholder ? await getFromDb(recipesQuery, searchPlaceholder.trim()) : [];

		return {
			page: {
				description: "Ищите рецепты по заголовкам и содержимому.",
				heading: "Поиск рецептов",
				pageTemplate: renderPageSection({
					footerTemplate:
						renderSearchForm({
							nof: searchPlaceholder ? cards.length : undefined,
							value: searchPlaceholder,
						}) +
						(searchPlaceholder
							? cards.length
								? renderCards({
										alt: "На фото изображено готовое блюдо [title] в миниатюре.",
										cards,
										centered: false,
										picturesHost,
									})
								: ""
							: ""),
					title: "Поиск рецептов",
				}),
			},
		};
	},
};

import { PROJECT_DESCRIPTION } from "#!/constants.js";
import { renderCards } from "#!/templates/cards.js";
import { renderPageSection } from "#!/templates/page-section.js";
import { html, sql } from "#!/utils/mark-template.js";
import { isDev } from "#server/constants.js";
import { getFromDb } from "#server/lib/db.js";

const recipesQuery = sql`
	SELECT id, title FROM recipes ${isDev ? "" : sql`WHERE published = 1`} ORDER BY id DESC LIMIT 12;
`;

const ALL_RECIPES_TEMPLATE = html`<a class="_centered _separated" href="/structure">Все рецепты</a>`;

const headTemplate = html`
	<link rel="preload" href="/images/hero.webp" as="image" type="image/webp" media="(min-width: 888px)">
	<link rel="preload" href="/images/hero-mobile.webp" as="image" type="image/webp" media="(max-width: 887px)">
`;

export const mainRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {DbItem[]} */
		const cards = await getFromDb(recipesQuery);

		return {
			page: {
				description: PROJECT_DESCRIPTION,
				headTemplate,
				pageTemplate:
					renderPageSection({
						footerTemplate: renderCards({
							alt: "На фото изображено готовое блюдо [title] в миниатюре.",
							cards,
						}),
						title: "Новые рецепты с эфирными маслами",
					}) + ALL_RECIPES_TEMPLATE,
			},
		};
	},
};

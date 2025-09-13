import { renderCards } from "#common/components/cards.js";
import { renderPageSection } from "#common/components/page-section.js";
import { PROJECT_DESCRIPTION } from "#common/constants.js";
import { html, sql } from "#common/utils/mark-template.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";

const recipesQuery = sql`
	SELECT id, title FROM recipes ${isDev ? "" : sql`WHERE published = 1`} ORDER BY id DESC LIMIT 12;
`;

const ALL_RECIPES_TEMPLATE = html`<a class="_centered _separated" href="/structure">Все рецепты</a>`;

const headTemplate = html`
	<link rel="preload" href="/images/hero.webp" as="image" type="image/webp" media="(min-width: 888px)">
	<link rel="preload" href="/images/hero-mobile.webp" as="image" type="image/webp" media="(max-width: 887px)">
`;

const PREAMBLE_TEMPLATE = html`
	<div class="content">
		<p>На этом сайте вы найдёте простые, быстрые и вкусные рецепты на каждый день или к праздничному столу. Все блюда готовятся из доступных продуктов, и с ними легко справятся даже начинающие хозяйки.</p>
		<p>Изюминкой данного сайта является то, что на нём представлены рецепты с эфирными маслами терапевтического класса doTERRA. <a href="/important">Важно</a> использовать только качественные, чистые, натуральные эфирные масла! Если вы не уверены в качестве своих эфирных масел, то не добавляйте их в блюдо. Лучше замените травами и специями, у вас всё равно получится вкусно.</p>
		<p>Все рецепты сопровождаются <a href="https://t.me/aroma_chef" target="_blank">видеоинструкциями</a>.</p>
	</div>
`;

export const mainRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {DbItem[]} */
		const cards = await processDb(recipesQuery);

		return {
			page: {
				description: PROJECT_DESCRIPTION,
				headTemplate,
				pageTemplate:
					PREAMBLE_TEMPLATE +
					renderPageSection({
						className: "_separated",
						footerTemplate: renderCards({
							alt: "На фото изображено готовое блюдо [title] в миниатюре.",
							cards,
						}),
						title: "Новые рецепты с эфирными маслами",
					}) +
					ALL_RECIPES_TEMPLATE,
			},
		};
	},
};

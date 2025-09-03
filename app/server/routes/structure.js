import { html, sql } from "#common/utils/mark-template.js";
import { renderCards } from "#components/cards.js";
import { renderTags } from "#components/tags.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";

const queryCondition = isDev ? "" : sql`AND published = 1`;
const query = sql`
	SELECT id, title, 0 AS tag FROM structures s
		WHERE (
			SELECT count(id) FROM recipes WHERE structureId = s.id ${queryCondition}
		) > 0
	UNION
	SELECT id, title, 1 AS tag FROM tags t
		WHERE (
			SELECT count(id) FROM recipes WHERE id IN (
				SELECT recipeId FROM recipesTags WHERE tagId = t.id
			)
			${queryCondition}
		) > 0
	ORDER BY title;
`;

export const structureRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {(DbItem & { tag: 0 | 1 })[]} */
		const structuresAndTags = await processDb(query);

		/** @type {(DbItem)[]} */
		const structures = [];

		/** @type {(DbItem)[]} */
		const tags = [];

		structuresAndTags.forEach(({ id, tag, title }) => {
			if (tag) {
				tags.push({ id, title });
			} else {
				structures.push({ id, title });
			}
		});

		return {
			page: {
				description: "Интересующие Вас рецепты Вы можете найти в соответствующих разделах или воспользоваться тегами.",
				heading: "Разделы и #теги",
				pageTemplate: html`
					<section class="structure">
						<div>
							<h1 class="structure__heading">Разделы</h1>
							${renderCards({
								alt: "На фото изображено готовое блюдо из раздела [title] в миниатюре.",
								cards: structures,
								centered: false,
								route: "/structure",
							})}
						</div>

						<div class="structure__tags" id="tags">
							<h2 class="structure__sideheading">Теги</h2>
							${renderTags({
								className: "structure__tags-list",
								column: true,
								tags,
							})}
						</div>
					</section>
				`,
			},
		};
	},
};

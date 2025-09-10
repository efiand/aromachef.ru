import { renderCards } from "#common/components/cards.js";
import { renderPageSection } from "#common/components/page-section.js";
import { sql } from "#common/utils/mark-template.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";

const query = sql`
	SELECT r.id, r.title, s.title AS structure FROM recipes r JOIN structures s
	WHERE s.id = r.structureId AND s.id = ?
	${isDev ? "" : sql`AND r.published = 1`}
	ORDER BY r.title;
`;

export const structureIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		const cards = await processDb(query, id);

		if (!cards.length) {
			throw new Error("Раздел не существует.", { cause: 404 });
		}

		const [{ structure }] = cards;

		return {
			page: {
				description: `Страница содержит рецепты с эфирными маслами из раздела «${structure}».`,
				heading: `${structure} | Разделы`,
				ogImage: `/pictures/structure/${id}@2x.webp`,
				pageTemplate: renderPageSection({
					footerTemplate: renderCards({
						alt: `На фото изображено готовое блюдо [title] из раздела «${structure}» в миниатюре.`,
						cards,
					}),
					title: structure,
				}),
			},
		};
	},
};

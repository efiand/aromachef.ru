import { renderCards } from "#!/templates/cards.js";
import { renderPageSection } from "#!/templates/page-section.js";
import { sql } from "#!/utils/mark-template.js";
import { isDev, picturesHost } from "#server/constants.js";
import { getFromDb } from "#server/lib/db.js";

const query = sql`
	SELECT r.id, r.title, s.title AS structure FROM recipes r JOIN structures s
	WHERE s.id = r.structureId AND s.id = ?
	${isDev ? "" : sql`AND r.published = 1`}
	ORDER BY r.title;
`;

export const structureIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		const cards = await getFromDb(query, id);

		if (!cards.length) {
			throw new Error("Раздел не существует.", { cause: 404 });
		}

		const [{ structure }] = cards;

		return {
			page: {
				description: `Страница содержит рецепты с эфирными маслами из раздела «${structure}».`,
				heading: `Разделы : ${structure}`,
				ogImage: `${picturesHost}/pictures/structure/${id}@2x.webp`,
				pageTemplate: renderPageSection({
					footerTemplate: renderCards({
						alt: `На фото изображено готовое блюдо [title] из раздела «${structure}» в миниатюре.`,
						cards,
						picturesHost,
					}),
					title: structure,
				}),
			},
		};
	},
};

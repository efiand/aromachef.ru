import { renderCards } from "#common/templates/cards.js";
import { renderStructure } from "#common/templates/structure.js";
import { isDev } from "#server/constants.js";
import { processDb } from "#server/lib/db.js";

const recipesQuery = /* sql */ `
	SELECT id, title FROM recipes WHERE structureId = ? ${isDev ? "" : /* sql */ `AND published = 1`}
	ORDER BY title;
`;
const structuresQuery = /* sql */ `
	SELECT id, title, (id = ?) AS current FROM structures s
		WHERE (
			SELECT count(id) FROM recipes WHERE structureId = s.id ${isDev ? "" : /* sql */ `AND published = 1`}
		) > 0
	ORDER BY title;
`;

export const structureIdRoute = {
	/** @type {RouteMethod} */
	async GET({ body, id, isAmp }) {
		/** @type {Promise<DbItem[]>[]} */
		const promises = [processDb(recipesQuery, id)];
		if (body.fragment === undefined) {
			promises.push(processDb(structuresQuery, id));
		}

		const [cards, structures = []] = await Promise.all(promises);

		if (body.fragment !== undefined) {
			return { template: renderCards({ cards, isAmp }) };
		}

		if (!cards.length) {
			throw new Error("Раздел не существует.", { cause: 404 });
		}

		const heading = structures.find((item) => item.id === id)?.title || "";

		return {
			page: {
				description: `Страница содержит рецепты с эфирными маслами из раздела «${heading}».`,
				heading: `${heading} | Разделы`,
				ogImage: `/pictures/structure/${id}@2x.webp`,
				pageTemplate: renderStructure({
					asideHeading: "Разделы",
					asyncSupport: true,
					cards,
					heading,
					isAmp,
					structures,
				}),
			},
		};
	},
};

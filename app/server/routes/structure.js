import { renderStructure } from "#common/templates/structure.js";
import { isDev } from "#server/constants.js";
import { getStructuresAndTags } from "#server/lib/structures-and-tags.js";

export const structureRoute = {
	/** @type {RouteMethod} */
	async GET({ isAmp }) {
		const [structures, tags] = await getStructuresAndTags(!isDev);

		return {
			page: {
				description: "Интересующие Вас рецепты Вы можете найти в соответствующих разделах или воспользоваться тегами.",
				heading: "Разделы и теги",
				pageTemplate: renderStructure({
					alt: "На фото изображено готовое блюдо из раздела [title] в миниатюре.",
					asideHeading: "Теги",
					asideId: "tags",
					cards: structures,
					heading: "Разделы",
					isAmp,
					route: "/structure",
					tags,
				}),
			},
		};
	},
};

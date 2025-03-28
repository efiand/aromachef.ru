import { PUBLISHED_QUERY } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

async function load() {
	const [items, tags] = await Promise.all([
		prisma.structures.findMany({
			orderBy: { title: 'asc' },
			where: { recipes: { some: PUBLISHED_QUERY } }
		}),
		prisma.tags.findMany({
			orderBy: { title: 'asc' },
			where: { recipes: { some: { recipe: PUBLISHED_QUERY } } }
		})
	]);
	return {
		description:
			'Интересующие Вас рецепты Вы можете найти в соответствующих разделах или воспользоваться тегами.',
		items,
		tags,
		title: 'Разделы и #теги'
	};
}

export { load };

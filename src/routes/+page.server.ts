import { PUBLISHED_QUERY } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

async function load() {
	const items = await prisma.recipes.findMany({
		orderBy: { publishedAt: 'desc' },
		select: { id: true, title: true },
		take: 12,
		where: PUBLISHED_QUERY
	});
	return {
		description: 'Быстрые, вкусные и полезные рецепты с эфирными маслами.',
		items,
		title: ''
	};
}

export { load };

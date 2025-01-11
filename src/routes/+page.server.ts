import { prisma } from '@/lib/prisma';

async function load() {
	const items = await prisma.recipes.findMany({
		orderBy: { publishedAt: 'desc' },
		select: { id: true, title: true },
		take: 12,
		where: { published: true }
	});
	return { items, title: '' };
}

export { load };

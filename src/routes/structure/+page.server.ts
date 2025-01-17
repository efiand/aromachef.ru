import { prisma } from '@/lib/prisma';

async function load() {
	const [items, tags] = await Promise.all([
		prisma.structures.findMany({
			orderBy: { title: 'asc' },
			where: { recipes: { some: { published: true } } }
		}),
		prisma.tags.findMany({
			orderBy: { title: 'asc' },
			where: { recipes: { some: { recipe: { published: { equals: true } } } } }
		})
	]);
	return { items, tags, title: 'Разделы и #теги' };
}

export { load };

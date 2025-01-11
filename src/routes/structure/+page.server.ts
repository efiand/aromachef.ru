import { prisma } from '@/lib/prisma';

async function load() {
	const [items, tags] = await Promise.all([
		prisma.structures.findMany({
			orderBy: { title: 'asc' }
		}),
		prisma.tags.findMany({
			orderBy: { title: 'asc' }
		})
	]);
	return { items, tags, title: 'Разделы и #теги' };
}

export { load };

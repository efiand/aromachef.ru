import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

async function load({ params }: Parameters<PageServerLoad>[0]) {
	const structure = await prisma.structures.findUnique({
		select: {
			id: true,
			recipes: {
				orderBy: { title: 'asc' },
				select: { id: true, title: true },
				where: { published: true }
			},
			title: true
		},
		where: {
			id: parseInt(params.id, 10),
			recipes: { some: { published: true } }
		}
	});

	if (!structure) {
		error(404, `Раздел № ${params.id} не найден.`);
	}

	const { id, title } = structure;
	return {
		entity: { id, title },
		items: structure.recipes,
		title: `Разделы : ${title}`
	};
}

export { load };

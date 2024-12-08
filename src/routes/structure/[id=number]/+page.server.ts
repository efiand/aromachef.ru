import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

async function load({ params }: Parameters<PageServerLoad>[0]) {
	const structure = await prisma.structures.findUnique({
		select: {
			id: true,
			recipes: {
				orderBy: { title: 'asc' },
				select: { id: true, title: true }
			},
			title: true
		},
		where: { id: parseInt(params.id, 10) }
	});

	if (!structure) {
		error(404, `Раздел № ${params.id} не найден.`);
	}
	return {
		entity: {
			id: structure.id,
			title: structure.title
		},
		items: structure.recipes
	};
}

export { load };

import { PUBLISHED_QUERY } from '@/lib/constants';
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
				where: PUBLISHED_QUERY
			},
			title: true
		},
		where: {
			id: parseInt(params.id, 10),
			recipes: { some: PUBLISHED_QUERY }
		}
	});

	if (!structure) {
		error(404, `Раздел № ${params.id} не найден.`);
	}

	const { id, title } = structure;
	return {
		description: `Страница содержит рецепты с эфирными маслами из раздела «${title}».`,
		entity: { id, title },
		items: structure.recipes,
		ogImage: `structure/${params.id}`,
		title: `Разделы : ${title}`
	};
}

export { load };

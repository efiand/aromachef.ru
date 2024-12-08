import type { ItemWrapper } from '@/types';

import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

async function load({ params }: Parameters<PageServerLoad>[0]) {
	const tag = await prisma.tags.findUnique({
		select: {
			id: true,
			recipes: {
				orderBy: { recipe: { title: 'asc' } },
				select: {
					recipe: {
						select: { id: true, title: true }
					}
				}
			},
			title: true
		},
		where: { id: parseInt(params.id, 10) }
	});

	if (!tag) {
		error(404, `Тег № ${params.id} не найден.`);
	}
	return {
		entity: {
			id: tag.id,
			title: tag.title
		},
		items: tag.recipes.map(recipeWrapperToRecipe)
	};
}

function recipeWrapperToRecipe({ recipe }: ItemWrapper) {
	return recipe;
}

export { load };

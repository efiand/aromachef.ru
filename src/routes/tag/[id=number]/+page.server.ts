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
				},
				where: { recipe: { published: true } }
			},
			title: true
		},
		where: {
			id: parseInt(params.id, 10),
			recipes: { some: { recipe: { published: { equals: true } } } }
		}
	});

	if (!tag) {
		error(404, `Тег № ${params.id} не найден.`);
	}

	const { id, title } = tag;
	return {
		entity: { id, title },
		items: tag.recipes.map(recipeWrapperToRecipe),
		title: `Теги : #${title}`
	};
}

function recipeWrapperToRecipe({ recipe }: ItemWrapper) {
	return recipe;
}

export { load };

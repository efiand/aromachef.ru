import { error } from '@sveltejs/kit';

import type { ItemWrapper } from '@/types';

import { PUBLISHED_QUERY } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

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
				where: { recipe: PUBLISHED_QUERY }
			},
			title: true
		},
		where: {
			id: parseInt(params.id, 10),
			recipes: { some: { recipe: PUBLISHED_QUERY } }
		}
	});

	if (!tag) {
		error(404, `Тег № ${params.id} не найден.`);
	}

	const { id, title } = tag;
	return {
		description: `На этой странице представлены рецепты с эфирными маслами на тему «${title.replaceAll('_', ' ')}».`,
		entity: { id, title },
		items: tag.recipes.map(recipeWrapperToRecipe),
		ogImage: `recipe/${tag.recipes[0].recipe.id}`,
		title: `Теги : #${title}`
	};
}

function recipeWrapperToRecipe({ recipe }: ItemWrapper) {
	return recipe;
}

export { load };

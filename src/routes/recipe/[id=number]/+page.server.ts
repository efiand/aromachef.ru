import { error } from '@sveltejs/kit';

import { getEnrichedRecipe } from '@/data/recipe';
import { PUBLISHED_QUERY } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

import type { PageServerLoad } from './$types';

async function load({ params }: Parameters<PageServerLoad>[0]) {
	const recipe = await prisma.recipes.findUnique({
		select: {
			cooking: true,
			description: true,
			ingredients: true,
			structure: true,
			tags: {
				orderBy: { tag: { title: 'asc' } },
				select: { tag: true }
			},
			telegramId: true,
			title: true
		},
		where: { id: parseInt(params.id, 10), ...PUBLISHED_QUERY }
	});

	if (!recipe) {
		error(404, `Рецепт № ${params.id} не найден.`);
	}

	const enrichedRecipe = getEnrichedRecipe(recipe);

	return {
		description: enrichedRecipe.description,
		ogImage: `recipe/${params.id}`,
		recipe: enrichedRecipe,
		title: `Рецепты : ${enrichedRecipe.title}`
	};
}

export { load };

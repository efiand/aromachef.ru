import type { BaseRecipe, EnrichedRecipe, Recipe } from '@/types';

import { TG_URL } from '@/lib/constants';
import { html } from '@/lib/mark-template';
import { minifyInternal } from '@/lib/minify';

function getEnrichedRecipe(recipe: Recipe): EnrichedRecipe {
	const { description, title } = recipe as BaseRecipe;

	return {
		...recipe,
		description: description
			? description
					.replaceAll('</p>', ' ')
					.replace(/<(\/?)([a-z]+)[^>]*(>|$)/gi, '')
					.trim()
			: `Страница содержит описание рецепта «${title}».`,
		enrichedDescription: getRecipeDescriptionTemplate(recipe as Recipe)
	};
}

function getRecipeDescriptionTemplate({ description, telegramId }: Recipe) {
	const ensuredDescription = description || '';

	if (!telegramId) {
		return ensuredDescription;
	}

	return minifyInternal(html`
		${ensuredDescription}
		<!-- prettier-ignore -->
		<p class="small">
			Посмотреть краткую видеоинструкцию или обсудить рецепт можно по 
			<a href="${TG_URL}/${telegramId}" target="_blank" rel="nofollow noopener">ссылке</a>.
		</p>
		<!-- prettier-ignore-end -->
	`);
}

function getSimpleRecipeTemplate(recipe: EnrichedRecipe) {
	return html`
		${recipe.enrichedDescription}
		<h2>Состав</h2>
		${recipe.ingredients}
		<h2>Приготовление</h2>
		${recipe.cooking}
	`;
}

export {
	getEnrichedRecipe,
	getRecipeDescriptionTemplate,
	getSimpleRecipeTemplate
};

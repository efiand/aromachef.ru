import type { BaseRecipe, EnrichedRecipe, Recipe } from '@/types';

import { TG_URL } from '@/lib/constants';
import { html } from '@/lib/make-template';
import { minifyInternal } from '@/lib/minify';

function prepareRecipe<T = BaseRecipe | Recipe>(recipe: T): EnrichedRecipe<T> {
	const { description, telegramId, title } = recipe as BaseRecipe;
	const ensuredDescription = description || '';

	return {
		...recipe,
		description: ensuredDescription
			? ensuredDescription.replace(/<(\/?)([a-z]+)[^>]*(>|$)/gi, '')
			: `Страница содержит описание рецепта «${title}».`,
		enrichedDescription: telegramId
			? minifyInternal(html`
					${ensuredDescription}
					<!-- prettier-ignore -->
					<p class="small">
						Посмотреть краткую видеоинструкцию или обсудить рецепт можно по <a href="${TG_URL}/${telegramId}" target="_blank" rel="nofollow noopener">ссылке</a>.
					</p>
					<!-- prettier-ignore-end -->
				`)
			: ensuredDescription
	};
}

export { prepareRecipe };

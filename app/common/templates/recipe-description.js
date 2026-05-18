/** @type {(recipe: { description: string; telegramId?: number? }) => string} */
export function renderRecipeDescription({ description, telegramId }) {
	const descriptionTemplate = /* html */ `<div itemprop="description">${description}</div>`;

	if (!telegramId) {
		return descriptionTemplate;
	}

	const url = `https://t.me/aroma_chef/${telegramId}`;

	return /* html */ `
		${descriptionTemplate}
		<p class="_small">
			Посмотреть видеорецепт можно в моём
			<a href="${url}" target="_blank" rel="nofollow noopener">telegram-канале</a>.
		</p>
	`;
}

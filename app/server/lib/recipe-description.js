import { html } from "#!/common/utils/mark-template.js";

/** @type {(recipe: { description: string; telegramId?: number | null }) => string} */
export function renderRecipeDescription({ description, telegramId }) {
	if (!telegramId) {
		return description;
	}

	const url = `https://t.me/aroma_chef/${telegramId}`;

	return html`
		${description}
		<p class="_small">
			Посмотреть видеорецепт можно в моём
			<a href="${url}" target="_blank" rel="nofollow noopener">telegram-канале</a>.
		</p>
	`;
}

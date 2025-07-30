import { html } from "#!/utils/mark-template.js";

/** @type {(recipe: { description: string; telegramId?: number | null }) => string} */
export function renderRecipeDescription({ description, telegramId }) {
	if (!telegramId) {
		return description;
	}

	const url = `https://t.me/aroma_chef/${telegramId}`;

	return html`
		${description}
		<p class="small">
			Посмотреть краткую видеоинструкцию или обсудить рецепт можно
			по <a href="${url}" target="_blank" rel="nofollow noopener">ссылке</a>.
		</p>
	`;
}

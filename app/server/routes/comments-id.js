import { processDb } from '#server/lib/db.js';
import { prepareText } from '#server/lib/prepare-text.js';
import { sendTgMessage } from '#server/lib/telegram.js';

const { TG_AROMACHEF_ID } = process.env;

const ADD_COMMENT_QUERY = /* sql */ `
	INSERT INTO comments (name, text, recipeId) VALUES (?, ?, ?);
`;
const COMMENTS_QUERY = /* sql */ `
	SELECT id, name, text, answer, publishedAt FROM comments
	WHERE recipeId = ? AND published = 1
	ORDER BY publishedAt DESC;
`;

export const commentsIdRoute = {
	/** @type {RouteMethod} */
	async GET({ id }) {
		/** @type {RecipeComment[]} */
		const comments = await processDb(COMMENTS_QUERY, id);
		return {
			contentType: 'application/json',
			template: JSON.stringify({ comments }),
		};
	},

	/** @type {RouteMethod} */
	async POST({ body, id }) {
		const { name, text } = /** @type {PostedComment} */ (body);
		/** @type {import('mysql2').ResultSetHeader} */
		const { insertId } = await processDb(ADD_COMMENT_QUERY, [
			name ? prepareText(name, true) : 'Гость',
			/* html */ `<p>${prepareText(text, true).replaceAll('\n', '</p><p>')}</p>`,
			id,
		]);

		const tgAnswer = `Новый комментарий!\nhttps://aromachef.ru/admin/comment/${insertId}`;

		await Promise.all([
			sendTgMessage({ text: tgAnswer }),
			sendTgMessage({ chat: { id: TG_AROMACHEF_ID }, text: tgAnswer }),
		]);

		return {
			template: /* html */ `<p>Комментарий отправлен на модерацию.</p>`,
		};
	},
};

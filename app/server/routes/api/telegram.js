import { sendTgMessage } from '#server/lib/telegram.js';

export const telegramRoute = {
	/** @type {RouteMethod} */
	async POST({ body }) {
		const { message } = /** @type {{ message: TelegramPayload }} */ (body);

		await sendTgMessage(message);

		return { template: 'OK' };
	},
};

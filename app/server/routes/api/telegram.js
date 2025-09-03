import { sendTgMessage } from "#server/lib/telegram.js";

export const telegramRoute = {
	/** @type {RouteMethod} */
	async POST({ body }) {
		await sendTgMessage(body.message);

		return { template: "OK" };
	},
};

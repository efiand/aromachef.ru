import { sendTgMessage } from "#server/lib/telegram.js";

export const telegramRoute = {
	/** @type {RouteMethod} */
	async POST({ body }) {
		if (body.message) {
			await sendTgMessage(JSON.parse(body.message));
		}

		return { template: "OK" };
	},
};

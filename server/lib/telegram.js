import TelegramBot from "node-telegram-bot-api";

const { TG_ADMIN_ID, TG_TOKEN, TG_AROMACHEF_ID } = process.env;

const bot = new TelegramBot(TG_TOKEN);

/** @type {TelegramBot.SendMessageOptions} */
const messageOptions = { parse_mode: "Markdown" };

/** @type {(payload: TelegramPayload) => Promise<void>} */
export async function sendTgMessage({ chat: { id = TG_ADMIN_ID, username = "aroma_chef_bot" } = {}, text }) {
	const template = `\`\`\`\n${text}\n\`\`\``;

	if (id === TG_ADMIN_ID || TG_AROMACHEF_ID) {
		await bot.sendMessage(id, template, messageOptions);
		return;
	}

	const user = username ? `@${username}` : id;
	await bot.sendMessage(TG_ADMIN_ID, `Сообщение от ${user}:\n${template}`, messageOptions);

	const answer = `Вы писали нам:\n${template}\nСпасибо за обращение! Наш администратор ответит Вам в ближайшее время.`;
	const addition = "\nЛогин в telegram отсутствует. Пожалуйста, пришлите ссылку для обратной связи.";

	await bot.sendMessage(id, `${answer}${username ? "" : addition}`, messageOptions);
}

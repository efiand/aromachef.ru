import TelegramBot from 'node-telegram-bot-api';
import { log } from '#common/lib/log.js';

const TG_ADMIN_ID = Number(process.env.TG_ADMIN_ID);
const TG_AROMACHEF_ID = Number(process.env.TG_AROMACHEF_ID);

const bot = new TelegramBot(process.env.TG_TOKEN);

/** @type {TelegramBot.SendMessageOptions} */
const messageOptions = { parse_mode: 'HTML' };

/** @type {(payload: TelegramPayload) => Promise<void>} */
export async function sendTgMessage({ chat: { id = TG_ADMIN_ID, username = 'aroma_chef_bot' } = {}, text }) {
	const template = text.trim();

	if (id === TG_ADMIN_ID || id === TG_AROMACHEF_ID) {
		// Собственный запрос
		log.error('❌ [TG OWN MESSAGE]', template);
		return;
	}

	const quote = /* html */ `<blockquote>${template}</blockquote>`;

	const user = username ? `@${username}` : id;
	await bot.sendMessage(TG_ADMIN_ID, /* html */ `Сообщение от ${user}:${quote}`, messageOptions);

	const answer =
		text === '/start'
			? 'Доброго времени суток! Мы готовы ответить на Ваши вопросы.'
			: `Вы писали нам:${quote}Спасибо за обращение! Наш администратор ответит Вам в ближайшее время.`;
	const addition = username ? '' : '\nЛогин в telegram отсутствует. Пожалуйста, пришлите ссылку для обратной связи.';

	await bot.sendMessage(id, `${answer}${addition}`, messageOptions);
}

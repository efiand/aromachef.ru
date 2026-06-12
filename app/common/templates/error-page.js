import { getEmailLink } from '#common/lib/get-email-link.js';

const emailLink = getEmailLink({ subject: 'Ошибка на сайте «АромаШеф»' });

/** @type {(heading: string, message: string) => string} */
export function renderErrorPage(heading, message) {
	return /* html */ `
		<div class="content">
			${heading ? /* html */ `<h1>${heading}</h1>` : ''}
			<p>${message}</p>
			<p>
				<a href="${emailLink}">Свяжитесь с разработчиком</a>.
				Отправляя письмо, вы соглашаетесь с <a href="/privacy">Политикой обработки персональных данных</a>.
			</p>
		</div>
	`;
}

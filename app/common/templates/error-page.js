/** @type {(heading: string, message: string) => string} */
export function renderErrorPage(heading, message) {
	return /* html */ `
		<div class="content">
			${heading ? /* html */ `<h1>${heading}</h1>` : ''}
			<p>${message}</p>
			<p>
				<a href="mailto:efiand@ya.ru?subject=aromachef">Свяжитесь с разработчиком</a>
				или напишите в <a href="https://t.me/aroma_chef_bot">telegram-бот</a>.
			</p>
		</div>
	`;
}

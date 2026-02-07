import { openModal } from "#client/components/modal.js";
import { renderFromTemplate } from "#client/lib/render-from-template.js";

const text = document.querySelector(`[name="description"]`)?.getAttribute("content") || "";

/** @type {ShareItem[]} */
const ITEMS = [
	{
		id: "vk",
		title: "ВКонтакте",
		url: `https://vk.com/share.php?url=${window.location}`,
	},
	{
		id: "tg",
		title: "Telegram",
		url: `https://t.me/share/url?url=${window.location}`,
	},
	{
		id: "wa",
		title: "WhatsApp",
		url: `https://api.whatsapp.com/send?text=${encodeURI(`${text} Подробнее: ${window.location}`)}`,
	},
	{
		id: "ok",
		title: "Одноклассники",
		url: `https://connect.ok.ru/offer?url=${window.location}`,
	},
];

const shareOpenerElement = renderFromTemplate(/* html */ `
	<button class="icon-button icon-button--share">
		<span>Поделиться</span>
	</button>
`);

const sharedElement = renderFromTemplate(/* html */ `
	<div class="share">
		<h2>Поделиться:</h2>

		<ul class="share__list">${ITEMS.map(renderItem).join("")}</ul>

		<div class="share__copy">
			<input readonly>
			<button class="button" type="button">Скопировать ссылку</button>

			<p class="share__copy-message">Ссылка скопирована.</p>
		</div>
	</div>
`);

const copyInputElement = /** @type {HTMLInputElement} */ (sharedElement.querySelector(".share__copy input"));

const copyStatusElement = /** @type {HTMLElement} */ (sharedElement.querySelector(".share__copy-message"));

sharedElement.querySelector("button")?.addEventListener("click", () => {
	navigator.clipboard.writeText(`${window.location}`);
	copyStatusElement.classList.add("share__copy-message--shown");

	setTimeout(() => {
		copyStatusElement.classList.remove("share__copy-message--shown");
	}, 1000);
});

/** @param {string} wrapperClassName */
export function initShare(wrapperClassName) {
	shareOpenerElement.addEventListener("click", onClickOpener);

	const [blockClassName] = wrapperClassName.split("__");
	shareOpenerElement.classList.add(`${blockClassName}__share`);

	document.querySelector(`.${wrapperClassName}`)?.append(shareOpenerElement);
}

function onClickOpener() {
	copyInputElement.value = window.location.href;
	openModal(sharedElement);
}

/** @type {(item: ShareItem) => string} */
function renderItem({ url, id, title }) {
	return /* html */ `
		<li>
			<a
				class="share__link share__link--${id}"
				href="${url}"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span>${title}</span>
			</a>
		</li>
	`;
}

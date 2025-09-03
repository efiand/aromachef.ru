import { html } from "#common/utils/mark-template.js";
import { NonNull } from "#common/utils/non-null.js";

const FORM_INNER_TEMPLATE = html`
	<input class="comments__name" name="name" aria-label="Имя" placeholder="Введите имя">
	<textarea name="text" rows="5" aria-label="Текст" placeholder="Напишите комментарий (до 3000 символов)" maxlength required></textarea>
	<button class="comments__button button" type="submit">Отправить</button>
`;

/** @type {(comment: RecipeComment) => string} */
function renderComment({ answer, name, text }) {
	const answerTemplate = answer
		? html`
				<blockquote class="comments__item comments__item--answer">
					<cite class="comments__author">
						<a href="/about">АромаШеф</a>
					</cite>
					${answer}
				</blockquote>
			`
		: "";

	return html`
		<li>
			<blockquote class="comments__item">
				<cite class="comments__author">${name}</cite>
				${text}
			</blockquote>
			${answerTemplate}
		</li>
	`;
}

/** @type {(comments: RecipeComment[]) => string} */
function renderTemplate(comments) {
	const countTemplate = comments.length ? `(${comments.length})` : "";
	const listTemplate = comments.length
		? html`
			<ul class="comments__list">
				${comments.map(renderComment).join("")}
			</ul>
		`
		: "";

	return html`
		<h2 class="comments__heading">Комментарии</h2>
		<button class="comments__toggler" aria-expanded="false" aria-controls="comments-body">
			Комментарии ${countTemplate}
		</button>
		<div class="comments__body" id="comments-body">
			${listTemplate}
			<form class="comments__form" method="post">
				${FORM_INNER_TEMPLATE}
			</form>
		</div>
	`;
}

/** @type {(element: HTMLDivElement) => Promise<void>} */
export async function initComments(element) {
	const res = await fetch(`${location.pathname}?comments`);

	/** @type {{ comments: RecipeComment[] }} */
	const { comments } = await res.json();

	element.innerHTML = renderTemplate(comments);

	/** @type {HTMLButtonElement} */
	const togglerElement = NonNull(element.querySelector(".comments__toggler"));
	const textOnClose = togglerElement.textContent;

	/** @type {HTMLDivElement} */
	const bodyElement = NonNull(element.querySelector(".comments__body"));

	/** @type {HTMLFormElement} */
	const formElement = NonNull(bodyElement.querySelector(".comments__form"));

	formElement.addEventListener("submit", async (event) => {
		event.preventDefault();

		const body = new FormData(formElement);
		const res = await fetch(location.pathname, {
			method: "POST",
			body,
		});
		if (res.ok) {
			const text = await res.text();
			formElement.innerHTML = html`
				${text}
				<button class="comments__button button" type="button" data-close>Отправить ещё</button>
			`;
		} else {
			formElement.insertAdjacentHTML(
				"beforeend",
				html`
					<p class="comments__error _error">Произошла ошибка.</p>
				`,
			);
		}
	});

	element.addEventListener("click", async ({ target }) => {
		if (!(target instanceof HTMLElement)) {
			return;
		}

		if (target === togglerElement) {
			if (element.classList.contains("comments--opened")) {
				togglerElement.textContent = textOnClose;
				togglerElement.ariaExpanded = "false";
			} else {
				togglerElement.textContent = "Скрыть";
				togglerElement.ariaExpanded = "true";
			}
			element.classList.toggle("comments--opened");
		} else if (typeof target.dataset.close !== "undefined") {
			formElement.innerHTML = FORM_INNER_TEMPLATE;
		}
	});
}

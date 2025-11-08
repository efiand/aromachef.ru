import { getElement } from "#client/lib/get-element.js";

const layoutElement = getElement("[data-layout]");

/** @type {HTMLElement | null} */
let modalElement = null;

/** @type {HTMLElement | null} */
let innerElement = null;

function close() {
	modalElement?.classList.remove("modal--opened");
	innerElement?.lastElementChild?.remove();
	document.removeEventListener("keydown", onKeydown);
	layoutElement.inert = false;
}

/** @param {PointerEvent} event */
function onModalClick({ target }) {
	if (!(target instanceof HTMLElement)) {
		return;
	}
	if (target.classList.contains("modal") || target.classList.contains("modal__close")) {
		close();
	}
}

function init() {
	document.body.insertAdjacentHTML("beforeend", renderModal());

	modalElement = getElement(".modal");
	innerElement = getElement(".modal__inner", modalElement);
	modalElement.addEventListener("click", onModalClick);
}

/** @param {KeyboardEvent} event */
function onKeydown(event) {
	if (event.key.startsWith("Esc")) {
		event.preventDefault();
		close();
	}
}

/** @param {HTMLElement} element */
export function openModal(element) {
	if (!modalElement) {
		init();
	}

	layoutElement.inert = true;
	innerElement?.append(element);
	document.addEventListener("keydown", onKeydown);
	modalElement?.classList.add("modal--opened");
}

function renderModal() {
	return /* html */ `
		<div class="modal">
			<div class="modal__inner">
				<button class="modal__close" type="button" aria-label="Закрыть окно"></button>
			</div>
		</div>
	`;
}

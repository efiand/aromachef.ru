import { html } from "#common/utils/mark-template.js";
import { NonNull } from "#common/utils/non-null.js";

const TEMPLATE = html`
	<div class="dialog__inner">
		<div class="dialog__slot"></div>
		<button class="dialog__close" type="button" aria-label="Закрыть"></button>
	</div>
`;

/** @type {{ element: HTMLDialogElement | null}} */
const dialogState = {
	element: null,
};

function initDialog() {
	const element = document.createElement("dialog");
	element.className = "dialog";
	element.innerHTML = TEMPLATE;

	const closeElement = NonNull(element.querySelector(".dialog__close"));
	const slotElement = NonNull(element.querySelector(".dialog__slot"));

	element.addEventListener("click", ({ target }) => {
		if (target === dialogState.element || target === closeElement) {
			dialogState.element?.close();
		}
	});

	element.addEventListener("close", () => {
		slotElement.innerHTML = "";
	});

	document.body.append(element);
	dialogState.element = element;
}

/** @type {(element: HTMLElement) => void} */
export function openDialog(element) {
	if (!dialogState.element) {
		initDialog();
	}

	dialogState.element?.querySelector(".dialog__slot")?.append(element);
	dialogState.element?.showModal();
}

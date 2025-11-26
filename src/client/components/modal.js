/** @type {Record<string, () => void>} */
const closeByModalId = {};

const layoutElement = /** @type {HTMLElement} */ (document.querySelector("[data-layout]"));

/** @type {HTMLElement | null} */
let modalElement = null;

/** @type {HTMLElement | null} */
let innerElement = null;

function close() {
	modalElement?.classList.remove("modal--opened");
	innerElement?.classList.remove("modal__inner--full-width");

	if (innerElement?.lastElementChild) {
		const {
			dataset: { modalId = "" },
		} = /** @type {HTMLElement} */ (innerElement.lastElementChild);

		innerElement.lastElementChild.remove();
		closeByModalId[modalId]?.();
	}

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

	modalElement = /** @type {HTMLElement} */ (document.querySelector(".modal"));
	innerElement = /** @type {HTMLElement} */ (modalElement?.querySelector(".modal__inner"));
	modalElement.addEventListener("click", onModalClick);
}

/** @param {KeyboardEvent} event */
function onKeydown(event) {
	if (event.key.startsWith("Esc")) {
		event.preventDefault();
		close();
	}
}

/** @type {(element: HTMLElement, fullWidth?: boolean, onClose?: () => void) => void} */
export function openModal(element, fullWidth = false, onClose) {
	if (!modalElement) {
		init();
	}

	const { modalId = "" } = element.dataset;
	if (modalId && onClose && !closeByModalId[modalId]) {
		closeByModalId[modalId] = onClose;
	}

	layoutElement.inert = true;
	innerElement?.append(element);
	if (fullWidth) {
		innerElement?.classList.add("modal__inner--full-width");
	}
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

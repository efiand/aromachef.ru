import { openModal } from "#client/components/modal.js";

/** @type {ComponentInitiator} */
export function initCheckers(element) {
	const innerElement = /** @type {HTMLElement} */ (element.firstElementChild);
	innerElement.dataset.modalId = element.dataset.checkers;

	document.querySelector(`[data-checkers-open="${element.dataset.checkers}"]`)?.addEventListener("click", () => {
		openModal(innerElement, true, () => {
			element.append(innerElement);
		});
	});
}

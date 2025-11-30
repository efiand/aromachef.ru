/** @type {ComponentInitiator} */
export function initSubmitter(element) {
	element.closest("form")?.addEventListener("submit", () => {
		element.setAttribute("aria-disabled", "true");
		element.setAttribute("data-loading", "");
	});
}

/** @type {ComponentInitiator} */
export function initSubmitter(element) {
	element.closest("form")?.addEventListener("submit", () => {
		element.setAttribute("disabled", "");
		element.setAttribute("data-loading", "");
	});
}

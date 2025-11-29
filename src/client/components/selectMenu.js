/** @type {ComponentInitiator} */
export function initSelectMenu(element) {
	const { endpoint = "" } = element.dataset;
	element.addEventListener("change", () => {
		const { value } = /** @type {HTMLSelectElement} */ (element);
		if (value) {
			window.location.href = `${endpoint}/${value}`;
		}
	});
}

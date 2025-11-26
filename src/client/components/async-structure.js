/** @type {Record<string, string>} */
const cache = {};

/**
 * @param {HTMLAnchorElement | undefined} linkElement
 * @param {NodeListOf<HTMLAnchorElement>} linkElements
 * @param {HTMLElement} cardsElement
 * @param {HTMLElement} element
 */
async function updateView(linkElement, linkElements, cardsElement, element) {
	if (!linkElement) {
		return;
	}
	const { href, textContent } = linkElement;
	if (!cache[href]) {
		const cardsTemplate = await fetch(`${href}?fragment`).then((res) => res.text());
		cache[href] = /* html */ `
			<h1>${textContent}</h1>
			${cardsTemplate}
		`;
	}
	cardsElement.innerHTML = cache[href];
	element.scrollIntoView();
	document.title = document.title.replace(/^.*?(?=\s\|)/, textContent);
	linkElements.forEach((itemElement) => {
		itemElement.ariaCurrent = itemElement === linkElement ? "page" : null;
	});
}

/** @type {ComponentInitiator} */
export function initAsyncStructure(element) {
	const cardsElement = /** @type {HTMLElement} */ (element.querySelector("[data-cards]"));
	const linkElements = /** @type {NodeListOf<HTMLAnchorElement>}*/ (element.querySelectorAll("[data-aside] a"));

	linkElements.forEach((linkElement, i) => {
		linkElement.addEventListener("click", async (event) => {
			if (event.ctrlKey) {
				return;
			}
			event.preventDefault();
			if (linkElement.ariaCurrent) {
				return;
			}

			updateView(linkElement, linkElements, cardsElement, element);
			window.history.pushState({ i, id: "structure" }, "", linkElement.href);
		});
	});

	window.addEventListener("popstate", async (event) => {
		/** @type {{ i: number }} */
		const { i = 0 } = event.state || {};

		updateView(linkElements[i], linkElements, cardsElement, element);
	});
}

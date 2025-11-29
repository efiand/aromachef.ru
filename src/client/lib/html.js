/**
 * Удаляет все теги, кроме указанных
 * @type {(element: HTMLElement, allowedTags: Set<string>, allowedClassNames: Set<string>) => void}
 */
export function clean(element, allowedTags, allowedClassNames) {
	for (const childElement of element.children) {
		cleanChildren(/** @type {HTMLElement} */ (childElement), allowedTags, allowedClassNames);
	}
}

/**
 * Удаляет все теги, кроме указанных
 * @type {(childElement: HTMLElement, allowedTags: Set<string>, allowedClassNames: Set<string>) => void}
 */
export function cleanChildren(childElement, allowedTags, allowedClassNames) {
	if (!allowedTags.has(childElement.tagName.toLowerCase())) {
		childElement.replaceWith(...childElement.childNodes);
	} else {
		// удаляем все классы кроме _small
		if (childElement.tagName.toLowerCase() === "p") {
			[...childElement.classList].forEach((className) => {
				if (!allowedClassNames.has(className)) {
					childElement.classList.remove(className);
				}
			});
		}
		clean(childElement, allowedTags, allowedClassNames);
	}
}

/**
 * Удаляет все теги, кроме указанных
 * @type {(html: string, allowedTags: Set<string>, allowedClassNames: Set<string>) => string}
 */
export function sanitizeHTML(html, allowedTags, allowedClassNames) {
	const wrapperElement = document.createElement("div");
	wrapperElement.innerHTML = html;

	clean(wrapperElement, allowedTags, allowedClassNames);

	return wrapperElement.innerHTML;
}

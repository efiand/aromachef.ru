import { initSearchDialog } from "#client/components/search-dialog.js";
import { initSearchInput } from "#client/components/search-input.js";
import { loadCssEntry, setScrollbarWidth } from "#client/lib/css.js";
import { loadScriptEntry } from "#client/lib/load-script.js";

setScrollbarWidth();

loadCssEntry("additional");

/** @type {NodeListOf<HTMLElement>} */
const hintedElements = document.querySelectorAll("[aria-label]");
hintedElements.forEach((element) => {
	element.title = element.ariaLabel || "";
});

/** @type {NodeListOf<HTMLElement>} */
const searchInputElements = document.querySelectorAll(".search-input");
// Гидратация полей поиска
searchInputElements.forEach(initSearchInput);

/** @type {NodeListOf<HTMLElement>} */
const searchOpenerElements = document.querySelectorAll("[data-search]");
// Гидратация диалога поиска
searchOpenerElements.forEach(initSearchDialog);

// Гидратация блоков комментариев
if (document.querySelector("[data-comments]")) {
	loadScriptEntry("comments");
}

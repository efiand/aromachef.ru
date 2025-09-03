import { loadCss, setScrollbarWidth } from "#client/lib/css.js";
import { version } from "#common/constants.js";
import { initComments } from "#components/comments.js";
import { initSearchDialog } from "#components/search-dialog.js";
import { initSearchInput } from "#components/search-input.js";

setScrollbarWidth();

loadCss(`/${window.isDev ? "client/css" : "bundles"}/additional.css?v${version.CSS}`);

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

/** @type {NodeListOf<HTMLDivElement>} */
const commentsElements = document.querySelectorAll(".comments");
// Гидратация блока комментариев
commentsElements.forEach(initComments);

import { initComments } from "#!/components/comments.js";
import { initSearchDialog } from "#!/components/search-dialog.js";
import { initSearchInput } from "#!/components/search-input.js";
import { loadCss } from "#!/utils/load-css.js";

// Некритический CSS
loadCss("icons.css?v1");
document.body.style.setProperty("--scrollbar-width", `${window.innerWidth - document.documentElement.clientWidth}px`);

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

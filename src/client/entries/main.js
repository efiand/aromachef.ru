import { initAsyncSearch } from "#client/components/async-search.js";
import { initAsyncStructure } from "#client/components/async-structure.js";
import { initSearchInput } from "#client/components/search-input.js";
import { initShare } from "#client/components/share.js";
import { loadCssEntry } from "#client/lib/css.js";
import { init } from "#client/lib/init.js";
import { loadScriptEntry } from "#client/lib/load-script.js";

loadCssEntry("additional");

init("[aria-label]", (element) => {
	element.title = element.ariaLabel || "";
});

init("[data-search-input]", initSearchInput);

init("[data-async-search]", initAsyncSearch);

init("[data-async-structure]", initAsyncStructure);

if (document.querySelector("[data-comments]")) {
	loadScriptEntry("comments");
} else {
	initShare(window.location.pathname === "/" ? "main-footer__share-place" : "layout__main");
}

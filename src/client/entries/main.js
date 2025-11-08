import { initAsyncSearch } from "#client/components/async-search.js";
import { initSearchInput } from "#client/components/search-input.js";
import { loadCssEntry } from "#client/lib/css.js";
import { init } from "#client/lib/init.js";
import { loadScriptEntry } from "#client/lib/load-script.js";

loadCssEntry("additional");

init("[aria-label]", (element) => {
	element.title = element.ariaLabel || "";
});

init(".search-input", initSearchInput);

init("[data-async-search]", initAsyncSearch);

if (document.querySelector("[data-comments]")) {
	loadScriptEntry("comments");
}

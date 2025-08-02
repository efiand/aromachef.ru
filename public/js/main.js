import { initSearchInput } from "#!/components/search-input.js";
import { html } from "./utils/mark-template.js";

// Некритический CSS
document.head.insertAdjacentHTML("beforeend", html`<link rel="stylesheet" href="/css/icons.css">`);

/** @type {NodeListOf<HTMLElement>} */
const searchInputElements = document.querySelectorAll("div.search-input");
searchInputElements.forEach(initSearchInput);

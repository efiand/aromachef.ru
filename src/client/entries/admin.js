import { initCheckers } from "#client/components/checkers.js";
import { initEditor } from "#client/components/editor.js";
import { initFilePicker } from "#client/components/file-picker.js";
import { initPasswordInput } from "#client/components/password-input.js";
import { init } from "#client/lib/init.js";

init("[data-file-picker]", initFilePicker);

init("[data-password-input]", initPasswordInput);

init("[data-checkers]", initCheckers);

init("[data-editor]", initEditor);

init(`.button[type="submit"]`, (element) => {
	element.closest("form")?.addEventListener("submit", () => {
		element.setAttribute("disabled", "");
		element.classList.add("button--loading");
	});
});

init("[data-select-menu]", (element) => {
	const { selectMenu = "" } = element.dataset;
	element.addEventListener("change", () => {
		const { value } = /** @type {HTMLSelectElement} */ (element);
		if (value) {
			window.location.href = `${selectMenu}/${value}`;
		}
	});
});

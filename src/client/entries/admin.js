import { initCheckers } from "#client/components/checkers.js";
import { initEditor } from "#client/components/editor.js";
import { initFilePicker } from "#client/components/file-picker.js";
import { initPasswordInput } from "#client/components/password-input.js";
import { initSelectMenu } from "#client/components/selectMenu.js";
import { initSubmitter } from "#client/components/submitter.js";
import { initComponents } from "#client/lib/init.js";

initComponents({
	checkers: initCheckers,
	editor: initEditor,
	filePicker: initFilePicker,
	passwordInput: initPasswordInput,
	selectMenu: initSelectMenu,
	submitter: initSubmitter,
});

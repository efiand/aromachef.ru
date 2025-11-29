import { debounce } from "#client/lib/debounce.js";
import { sanitizeHTML } from "#client/lib/html.js";
import { loadScript } from "#client/lib/load-script.js";
import { version } from "#common/constants.js";

const allowedTags = new Set(["a", "br", "li", "ol", "p", "strong", "ul"]);
const allowedClassNames = new Set(["_small"]);

/** @type {import('tinymce').RawEditorOptions} */
const config = {
	block_formats: "Paragraph=p;",
	body_class: "content",
	branding: false,
	content_css: window.isDev ? "/client/css/critical.css" : `/bundles/critical.css?v${version.CSS}`,
	convert_urls: false,
	entity_encoding: "raw",
	forced_root_block: undefined,
	license_key: "gpl",
	menubar: false,
	plugins: "autoresize code link lists",
	resize: false,
	setup(editor) {
		editor.ui.registry.addButton("clearContent", {
			onAction() {
				editor.setContent(sanitizeHTML(editor.getContent(), allowedTags, allowedClassNames));
				editor.save();
			},
			text: "Очистить",
			tooltip: "Очистить форматирование",
		});

		editor.ui.registry.addToggleButton("smallToggle", {
			onAction() {
				toggleClass(editor, "_small", new Set(["p"]));
			},
			onSetup(api) {
				const handler = () => {
					const block = editor.selection.getStart();
					const element = editor.dom.getParent(block, "p");

					api.setActive(element ? editor.dom.hasClass(element, "_small") : false);
				};

				editor.on("NodeChange", handler);
				return () => editor.off("NodeChange", handler);
			},
			text: "small",
			tooltip: "Мелкий текст",
		});

		const sync = debounce(() => editor.save(), 200);

		editor.on("input", sync);
		editor.on("change", sync);
	},
	skin: "oxide",
	statusbar: false,
	toolbar: `undo redo bold smallToggle bullist numlist link unlink clearContent code`,
	valid_elements: `p[class],a[href],strong/b,ul,ol,li,br`,
};

/** @type {(element: HTMLElement) => Promise<void>} */
export async function initEditor(target) {
	if (!window.tinymce) {
		await loadScript("/vendors/tinymce.js?v8.2.2");
	}

	window.tinymce.init({ ...config, target });
}

/** @type {(editor: import('tinymce').Editor, className: string, allowedTags: Set<string>) => void} */
function toggleClass(editor, className, allowedTags) {
	const blocks = editor.selection.getSelectedBlocks();

	if (!blocks.length) return;

	editor.undoManager.transact(() => {
		blocks.forEach((block) => {
			if (allowedTags.has(block.nodeName.toLowerCase())) {
				editor.dom.toggleClass(block, className);
			}
		});
	});
}

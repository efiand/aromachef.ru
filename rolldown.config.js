import { defineConfig } from "rolldown";
import { log } from "#common/lib/log.js";
import { minifyHtml } from "#server/lib/minify-html.js";

/**
 * Функция для минификации HTML в шаблонных литералах
 * @type {() => import('rolldown').Plugin}
 */
function minifyHtmlLiterals() {
	return {
		name: "minify-html-literals",

		async transform(code, id) {
			const htmlTemplateRegex = /\/\*\s*html\s*\*\/\s*`([\s\S]*?)`/g;

			let transformedCode = code;
			let match = htmlTemplateRegex.exec(code);

			while (match !== null) {
				const [fullMatch, htmlContent] = match;

				try {
					const minifiedHtml = await minifyHtml(htmlContent);

					const minifiedLiteral = fullMatch.replace(htmlContent, minifiedHtml);
					transformedCode = transformedCode.replace(fullMatch, minifiedLiteral);
				} catch (error) {
					log.error(`Ошибка минификации HTML в файле ${id}:`, error);
				}

				// Получаем следующее совпадение
				match = htmlTemplateRegex.exec(code);
			}

			return transformedCode;
		},
	};
}

export default defineConfig(
	process.env.npm_lifecycle_event === "build:vendors"
		? ["petite-vue", "tinymce"].map((entryName) =>
				defineConfig({
					input: `src/client/vendors/${entryName}.js`,
					output: {
						file: `public/vendors/${entryName}.js`,
						format: "iife",
						minify: true,
					},
				}),
			)
		: ["admin", "comments", "main"].map((entryName) =>
				defineConfig({
					input: `src/client/entries/${entryName}.js`,
					output: {
						file: `public/bundles/${entryName}.js`,
						format: "iife",
						minify: true,
					},
					plugins: [minifyHtmlLiterals()],
				}),
			),
);

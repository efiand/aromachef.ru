import htmlMinifier from "html-minifier-terser";
import { defineConfig } from "rolldown";

const MINIFIER_CONFIG = {
	caseSensitive: true,
	collapseWhitespace: true,
	conservativeCollapse: false,
	removeAttributeQuotes: true,
	removeComments: true,
	removeEmptyAttributes: true,
};

/**
 * Функция для минификации HTML в шаблонных литералах
 *
 * @type {() => import('rolldown').Plugin}
 */
function minifyHtmlLiterals() {
	return {
		name: "minify-html-literals",

		async transform(code, id) {
			const htmlTemplateRegex = /(html`)([\s\S]*?)`/g;

			let transformedCode = code;
			let match = htmlTemplateRegex.exec(code);

			while (match !== null) {
				const [fullMatch, tag, htmlContent] = match;

				try {
					const minifiedHtml = await htmlMinifier.minify(htmlContent, MINIFIER_CONFIG);

					const minifiedLiteral = fullMatch.replace(htmlContent, minifiedHtml).replace(tag, "`");
					transformedCode = transformedCode.replace(fullMatch, minifiedLiteral);
				} catch (error) {
					console.error(`Ошибка минификации HTML в файле ${id}:`, error);
				}

				// Получаем следующее совпадение
				match = htmlTemplateRegex.exec(code);
			}

			return transformedCode.replace(/NonNull\((.*)\);/g, "$1");
		},
	};
}

export default defineConfig({
	input: "src/client/main.js",
	output: {
		file: "public/bundles/main.js",
		format: "iife",
		minify: true,
	},
	plugins: [minifyHtmlLiterals()],
});

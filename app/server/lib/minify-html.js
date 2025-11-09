import htmlMinifier from "html-minifier-terser";

const MINIFIER_CONFIG = {
	caseSensitive: true,
	collapseWhitespace: true,
	conservativeCollapse: false,
	removeAttributeQuotes: true,
	removeComments: true,
	removeEmptyAttributes: true,
};

/** @type {(html: string) => Promise<string>} */
export async function minifyHtml(html) {
	const minifiedHtml = await htmlMinifier.minify(html, MINIFIER_CONFIG);

	// Принудительно добавляем кавычки вокруг шаблонных литералов
	return minifiedHtml.replace(/=(\$\{.*?\})/g, '="$1"');
}

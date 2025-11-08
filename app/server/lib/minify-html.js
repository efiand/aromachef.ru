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
	return minifiedHtml.replace(/value=(\$\{.*?\})/g, 'value="$1"');
}

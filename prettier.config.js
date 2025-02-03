export default {
	htmlWhitespaceSensitivity: 'ignore',
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		},
		{
			files: '*.html',
			options: {
				printWidth: Infinity
			}
		}
	],
	plugins: ['prettier-plugin-svelte'],
	quoteProps: 'consistent',
	singleQuote: true,
	trailingComma: 'none',
	useTabs: true
};

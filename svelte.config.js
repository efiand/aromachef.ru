import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const { AMP } = process.env;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter({
			out: `build/${AMP ? 'amp' : 'www'}`
		}),
		alias: {
			'@': 'src'
		},
		inlineStyleThreshold: AMP ? Infinity : 0
	},
	preprocess: vitePreprocess()
};

export default config;

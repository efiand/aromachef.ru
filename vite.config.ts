import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "@/scss/env" as *;',
				api: 'modern-compiler'
			}
		}
	},
	plugins: [sveltekit()]
});

import { defineConfig } from "rolldown";

export default defineConfig({
	input: "public/js/main.js",
	output: {
		file: "public/js/main.bundle.js",
		format: "iife",
		minify: true,
	},
});

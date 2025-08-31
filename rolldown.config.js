import { defineConfig } from "rolldown";

export default defineConfig({
	input: "app/client/main.js",
	output: {
		file: "public/bundles/main.js",
		format: "iife",
		minify: true,
	},
});

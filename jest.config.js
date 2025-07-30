/** @type {import('jest').Config} */
export default {
	detectOpenHandles: true,
	forceExit: true,
	preset: "@html-validate/jest-config",
	setupFiles: ["./test/setup.js"],
	silent: true,
	transform: {},
};

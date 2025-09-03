/** @type {import('jest').Config} */
export default {
	collectCoverage: false,
	detectOpenHandles: true,
	forceExit: true,
	preset: "@html-validate/jest-config",
	setupFiles: ["./test/setup.js"],
	silent: true,
	transform: {},
};

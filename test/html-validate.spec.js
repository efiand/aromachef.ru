import { info } from "node:console";
import { HtmlValidate } from "html-validate";
import { port } from "#server/constants.js";
import { createApp } from "#server/lib/app.js";

const HOST = `http://localhost:${port}`;
const timeout = Number(process.env.TEST_TIMEOUT) || 5000;

const htmlvalidate = new HtmlValidate({
	extends: ["html-validate:recommended"],
	rules: {
		"long-title": "off",
		"no-trailing-whitespace": "off",
	},
});

/** @type {string[]} */
let pages = [];

/** @type {string[]} */
let markups = [];

/** @type {import("node:http").Server | undefined} */
let server;

beforeAll(async () => {
	server = createApp();
	pages = await fetch(`${HOST}/api/pages`).then((res) => res.json());
	markups = await Promise.all(pages.map((page) => fetch(`${HOST}${page}`).then((res) => res.text())));
}, timeout);

describe("Testing markups", () => {
	test("All pages have valid HTML markup", async () => {
		let errorsCount = 0;

		await Promise.all(
			pages.map(async (page, i) => {
				const report = await htmlvalidate.validateString(markups[i]);
				if (!report.valid) {
					errorsCount++;
					report.results.forEach(({ messages }) => {
						messages.forEach(({ column, line, ruleUrl }) => {
							info(`${page} [${line}:${column}] (${ruleUrl})`);
						});
					});
				}
			}),
		);

		expect(errorsCount).toEqual(0);
	});
});

afterAll(() => {
	server?.close();
});

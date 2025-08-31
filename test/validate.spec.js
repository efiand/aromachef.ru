import { error, warn } from "node:console";
import amphtmlValidator from "amphtml-validator";
import { HtmlValidate } from "html-validate";
import { lintBem } from "posthtml-bem-linter";
import { host } from "#!/server/constants.js";
import { createApp } from "#!/server/lib/app.js";

const timeout = Number(process.env.TEST_TIMEOUT) || 20_000;

const htmlvalidate = new HtmlValidate({
	extends: ["html-validate:recommended"],
	rules: {
		"long-title": "off",
		"no-trailing-whitespace": "off",
	},
});

/** @type {amphtmlValidator.Validator | undefined} */
let ampValidator;

/** @type {string[]} */
let markups = [];

/** @type {string[]} */
let pages = [];

/** @type {import("node:http").Server | undefined} */
let server;

beforeAll(async () => {
	if (!server) {
		server = createApp();
	}

	if (!pages.length) {
		pages = await fetch(`${host}/api/pages`).then((res) => res.json());
	}

	if (!markups.length) {
		markups = await Promise.all(pages.map((page) => fetch(`${host}${page}`).then((res) => res.text())));
	}
}, timeout);

describe("Testing markups", () => {
	test(
		"All pages have valid HTML markup",
		async () => {
			let errorsCount = 0;

			await Promise.all(
				pages.map(async (page, i) => {
					const report = await htmlvalidate.validateString(markups[i]);
					if (!report.valid) {
						errorsCount++;
						report.results.forEach(({ messages }) => {
							messages.forEach(({ column, line, ruleUrl }) => {
								error(`${page} [${line}:${column}] (${ruleUrl})`);
							});
						});
					}
				}),
			);

			expect(errorsCount).toEqual(0);
		},
		timeout,
	);

	test(
		"All pages have valid BEM classes in markup",
		() => {
			let errorsCount = 0;

			pages.forEach(async (page, i) => {
				const result = lintBem({ content: markups[i], log: error, name: page });
				if (result.warningCount) {
					errorsCount++;
				}
			});

			expect(errorsCount).toEqual(0);
		},
		timeout,
	);

	test(
		"All AMP versions have valid AMP markup",
		async () => {
			let errorsCount = 0;

			if (!ampValidator) {
				ampValidator = await amphtmlValidator.getInstance();
			}

			await Promise.all(
				pages.map(async (page) => {
					const url = page === "/" ? "/amp" : `/amp${page}`;
					const markup = await fetch(`${host}${url}`).then((res) => res.text());

					/** @type {amphtmlValidator.ValidationResult | undefined} */
					const result = ampValidator?.validateString(markup);
					if (result?.status === "FAIL") {
						errorsCount++;
					}

					result?.errors.forEach(({ col, line, message, severity, specUrl }) => {
						const log = severity === "ERROR" ? error : warn;
						log(`${url} [${line}:${col}] ${message} ${specUrl ? `\n(${specUrl})` : ""})`);
					});
				}),
			);

			expect(errorsCount).toEqual(0);
		},
		timeout,
	);
});

afterAll(() => {
	server?.close();
});

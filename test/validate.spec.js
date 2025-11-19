import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { after, before, test } from "node:test";
import amphtmlValidator from "amphtml-validator";
import { XMLValidator } from "fast-xml-parser";
import { HtmlValidate } from "html-validate";
import { lintBem } from "posthtml-bem-linter";
import { STATIC_PAGES } from "#common/constants.js";
import { host } from "#server/constants.js";
import { createApp } from "#server/lib/app.js";

const { AUTH_LOGIN, AUTH_PASSWORD } = process.env;

const htmlvalidate = new HtmlValidate({
	extends: ["html-validate:recommended"],
	rules: {
		"long-title": "off",
		"no-trailing-whitespace": "off",
	},
});

const adminPages = ["/admin", "/admin/recipe/0"];

/** @type {amphtmlValidator.Validator | undefined} */
let ampValidator;

/** @type {string[]} */
let markups = [];

const pages = [...STATIC_PAGES, "/search", "/search", "/admin/auth"];

/** @type {string[]} */
let ampPages = [];

/** @type {import("node:http").Server | undefined} */
let server;

let authorized = false;

async function getMarkup(page = "") {
	return await fetch(`${host}${page}`).then((res) => res.text());
}

before(async () => {
	if (!server) {
		server = createApp(async (req, res, next) => {
			const { pathname } = new URL(`${host}${req.url}`);
			const ext = path.extname(pathname);
			if (ext === ".html") {
				try {
					const filePath = path.join(process.cwd(), "./public", pathname);
					await access(filePath);
					res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
					createReadStream(filePath).pipe(res);
					return;
				} catch (error) {
					console.error(error);
				}
			}

			next?.(req, res);
		});
	}

	if (!ampPages.length) {
		ampPages = await fetch(`${host}/api/pages`).then((res) => res.json());
		pages.push(...ampPages);
	}

	if (!markups.length) {
		markups = await Promise.all(pages.map(getMarkup));
	}

	({ ok: authorized } = await fetch(`${host}/admin/auth`, {
		body: `login=${AUTH_LOGIN}&password=${AUTH_PASSWORD}`,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		method: "POST",
	}));

	const adminMarkups = await Promise.all(adminPages.map(getMarkup));
	markups.push(...adminMarkups);
});

test("Success authorization", async () => {
	assert.strictEqual(authorized, true);
});

test("All pages have valid HTML markup", async () => {
	let errorsCount = 0;

	await Promise.all(
		pages.map(async (page, i) => {
			const report = await htmlvalidate.validateString(markups[i]);
			if (!report.valid) {
				errorsCount++;
				report.results.forEach(({ messages }) => {
					messages.forEach(({ column, line, message, ruleUrl }) => {
						console.error(`${page} [${line}:${column}] ${message} (${ruleUrl})`);
					});
				});
			}
		}),
	);

	assert.strictEqual(errorsCount, 0);
});

test("All pages have valid BEM classes in markup", () => {
	let errorsCount = 0;

	pages.forEach(async (page, i) => {
		const result = lintBem({ content: markups[i], log: console.error, name: page });
		if (result.warningCount) {
			errorsCount++;
		}
	});

	assert.strictEqual(errorsCount, 0);
});

test("All AMP versions have valid AMP markup", async () => {
	let errorsCount = 0;

	if (!ampValidator) {
		ampValidator = await amphtmlValidator.getInstance();
	}

	await Promise.all(
		ampPages.map(async (page) => {
			if (page.endsWith(".html")) {
				return;
			}

			const url = page === "/" ? "/amp" : `/amp${page}`;
			const markup = await fetch(`${host}${url}`).then((res) => res.text());

			/** @type {amphtmlValidator.ValidationResult | undefined} */
			const result = ampValidator?.validateString(markup);
			if (result?.status === "FAIL") {
				errorsCount++;
			}

			result?.errors.forEach(({ col, line, message, severity, specUrl }) => {
				const log = severity === "ERROR" ? console.error : console.warn;
				log(`${url} [${line}:${col}] ${message} ${specUrl ? `\n(${specUrl})` : ""})`);
			});
		}),
	);

	assert.strictEqual(errorsCount, 0);
});

test("sitemap.xml is valid", async () => {
	const markup = await fetch(`${host}/sitemap.xml`).then((res) => res.text());
	const result = XMLValidator.validate(markup);
	const valid = result === true;

	if (!valid) {
		const { msg, line, col } = result.err;
		console.error(`sitemap.xml [${line}:${col}] ${msg}`);
	}

	assert.strictEqual(valid, true);
});

after(async () => {
	server?.close();
	setTimeout(process.exit, 0);
});

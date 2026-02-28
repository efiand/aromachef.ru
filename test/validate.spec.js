import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import amphtmlValidator from 'amphtml-validator';
import { XMLValidator } from 'fast-xml-parser';
import { HtmlValidate } from 'html-validate';
import { lintBem } from 'posthtml-bem-linter';
import { STATIC_PAGES } from '#common/constants.js';
import { log } from '#common/lib/log.js';
import { host } from '#server/constants.js';
import { closeApp, createApp } from '#server/lib/app.js';
import validatorConfig from '../.htmlvalidate.js';

const { AUTH_LOGIN, AUTH_PASSWORD } = process.env;

const htmlvalidate = new HtmlValidate(validatorConfig);

const adminPages = [
	'/admin',
	'/admin/blog/0',
	'/admin/comment/18',
	'/admin/comments/17',
	'/admin/recipe/0',
	'/admin/recipe/1',
	'/admin/structures',
	'/admin/tags',
];
const pages = [...STATIC_PAGES, '/search', '/admin/auth'];

/** @type {string?} */
let adminCookie = null;

/** @type {amphtmlValidator.Validator | undefined} */
let ampValidator;

/** @type {string[]} */
let ampPages = [];

let isAuthorized = false;

/** @type {string[]} */
let markups = [];

/** @type {import("node:http").Server | undefined} */
let server;

async function getMarkup(page = '') {
	return await fetch(`${host}${page}`, {
		headers: adminCookie && page !== '/admin/auth' ? { Cookie: adminCookie } : undefined,
	}).then((res) => res.text());
}

before(async () => {
	if (!server) {
		server = createApp();
	}

	if (!ampPages.length) {
		ampPages = await fetch(`${host}/api/pages`).then((res) => res.json());
		pages.push(...ampPages);
	}

	const authResponse = await fetch(`${host}/admin/auth`, {
		body: `login=${AUTH_LOGIN}&password=${AUTH_PASSWORD}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
		redirect: 'manual',
	});
	if (authResponse.status === 302) {
		adminCookie = authResponse.headers.get('set-cookie');
		isAuthorized = true;
		pages.push(...adminPages);
	}

	if (!markups.length) {
		markups = await Promise.all(pages.map(getMarkup));
	}
});

test('Success authorization', async () => {
	assert.strictEqual(isAuthorized, true);
});

test('All pages have valid HTML markup', async () => {
	let errorsCount = 0;

	await Promise.all(
		pages.map(async (page, i) => {
			const report = await htmlvalidate.validateString(markups[i]);
			if (!report.valid) {
				errorsCount++;
				report.results.forEach(({ messages }) => {
					messages.forEach(({ column, line, message, ruleUrl, severity }) => {
						const output = severity === 2 ? log.error : log.warn;
						const icon = severity === 2 ? '❌' : '⚠';
						output(`${icon} ${page} [${line}:${column}] ${message} (${ruleUrl})`);
					});
				});
			}
		}),
	);

	assert.strictEqual(errorsCount, 0);
});

test('All pages have valid BEM classes in markup', () => {
	let errorsCount = 0;

	pages.forEach((page, i) => {
		const result = lintBem({ content: markups[i], log: log.error, name: page });
		if (result.warningCount) {
			errorsCount++;
		}
	});

	assert.strictEqual(errorsCount, 0);
});

test('All AMP versions have valid AMP markup', async () => {
	let errorsCount = 0;

	if (!ampValidator) {
		ampValidator = await amphtmlValidator.getInstance();
	}

	await Promise.all(
		ampPages.map(async (page) => {
			if (page.endsWith('.html')) {
				return;
			}

			const url = page === '/' ? '/amp' : `/amp${page}`;
			const markup = await fetch(`${host}${url}`).then((res) => res.text());

			/** @type {amphtmlValidator.ValidationResult | undefined} */
			const result = ampValidator?.validateString(markup);
			if (result?.status === 'FAIL') {
				errorsCount++;
			}

			result?.errors.forEach(({ col, line, message, severity, specUrl }) => {
				const output = severity === 'ERROR' ? log.error : log.warn;
				const icon = severity === 'ERROR' ? '❌' : '⚠';
				output(`${icon} ${url} [${line}:${col}] ${message} ${specUrl ? `\n(${specUrl})` : ''})`);
			});
		}),
	);

	assert.strictEqual(errorsCount, 0);
});

test('sitemap.xml is valid', async () => {
	const markup = await fetch(`${host}/sitemap.xml`).then((res) => res.text());
	const result = XMLValidator.validate(markup);
	const valid = result === true;

	if (!valid) {
		const { msg, line, col } = result.err;
		log.error(`❌ sitemap.xml [${line}:${col}] ${msg}`);
	}

	assert.strictEqual(valid, true);
});

after(async () => {
	await closeApp(server);
});

import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { HtmlValidate } from 'html-validate';
import * as bemLinter from 'posthtml-bem-linter';
import { STATIC_PAGES } from '#common/constants.js';
import { log } from '#common/lib/log.js';
import { closeApp, createApp, getAppHost, waitForApp } from '#server/lib/app.js';
import validatorConfig from '../../.htmlvalidate.js';

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

let isAuthorized = false;

/** @type {string[]} */
let markups = [];

/** @type {import("node:http").Server | undefined} */
let server;

async function getMarkup(page = '') {
	return await fetch(`${getAppHost(server)}${page}`, {
		headers: adminCookie && page !== '/admin/auth' ? { Cookie: adminCookie } : undefined,
	}).then((res) => res.text());
}

describe('Integration', () => {
	before(async () => {
		if (!server) {
			server = createApp({ isQuiet: true, port: 0 });
			await waitForApp(server);
		}

		const dynamicPages = await fetch(`${getAppHost(server)}/api/pages`).then((res) => res.json());
		pages.push(...dynamicPages);

		const authResponse = await fetch(`${getAppHost(server)}/admin/auth`, {
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

	after(async () => {
		await closeApp(server);
	});

	describe('Auth', () => {
		test('Success authorization', () => {
			assert.strictEqual(isAuthorized, true);
		});
	});

	describe('Markup', () => {
		test('All pages have valid HTML markup', async () => {
			let errorsCount = 0;

			await Promise.all(
				pages.map(async (page, index) => {
					const report = await htmlvalidate.validateString(markups[index]);
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

			pages.forEach((page, index) => {
				const result = bemLinter.lintBem({ content: markups[index], log: log.error, name: page });
				if (result.warningCount) {
					errorsCount++;
				}
			});

			assert.strictEqual(errorsCount, 0);
		});
	});

	describe('Pages', () => {
		test('Home page includes hero section', async () => {
			const markup = await getMarkup('/');

			assert.match(markup, /class="hero"/);
		});

		test('Structure page includes sections list', async () => {
			const markup = await getMarkup('/structure');

			assert.match(markup, /class="structure"/);
			assert.match(markup, /Разделы и теги/);
		});

		test('Search page includes search form', async () => {
			const markup = await getMarkup('/search');

			assert.match(markup, /class="search-form"/);
			assert.match(markup, /Поиск рецептов/);
		});

		test('Unknown route returns 404 page', async () => {
			const markup = await getMarkup('/unknown-page');

			assert.match(markup, /Ошибка 404/);
			assert.match(markup, /Страница не найдена/);
		});
	});
});

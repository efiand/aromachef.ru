import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { BASE_URL, PROJECT_TITLE } from '#common/constants.js';
import { isDev } from '#server/constants.js';
import { renderPage } from '#server/lib/page.js';

describe('Server/Page', () => {
	test('Renders complete html document for home page', async () => {
		const html = await renderPage({
			heading: 'Главная',
			isAuthorized: false,
			pageTemplate: '<main class="hero"></main>',
			pathname: '/',
		});

		assert.match(html, /<!DOCTYPE html>/);
		assert.match(html, /<html lang="ru"/);
		assert.match(html, new RegExp(`<title>Главная \\| ${PROJECT_TITLE}</title>`));
		assert.match(html, /\/bundles\/main\.css/);
		assert.match(html, new RegExp(`property="og:url" content="${BASE_URL}/"`));
		assert.match(html, new RegExp(`rel="canonical" href="${BASE_URL}/"`));
	});

	test('Uses admin bundle and layout for admin pages', async () => {
		const html = await renderPage({
			heading: 'Панель',
			isAuthorized: true,
			pageTemplate: '<main></main>',
			pathname: '/admin',
		});

		assert.match(html, /\/bundles\/admin\.css/);
		assert.match(html, /\/bundles\/admin\.js/);
		assert.match(html, /header__extra--logout/);
	});

	test('Includes Yandex Metrika in production mode', { skip: isDev }, async () => {
		const html = await renderPage({ isAuthorized: false, pageTemplate: '', pathname: '/' });

		assert.match(html, /Yandex\.Metrika/);
	});
});

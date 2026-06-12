import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { renderErrorPage } from '#common/templates/error-page.js';

describe('Templates/Error-page', () => {
	test('Includes mailto and privacy consent links', () => {
		const markup = renderErrorPage('Ошибка 404', 'Страница не найдена.');

		assert.match(markup, /mailto:/);
		assert.match(markup, /href="\/privacy"/);
		assert.match(markup, /Отправляя письмо, вы соглашаетесь/);
		assert.match(markup, /Страница не найдена/);
	});

	test('Omits heading when empty string is passed', () => {
		const markup = renderErrorPage('', 'Сообщение об ошибке.');

		assert.doesNotMatch(markup, /<h1>/);
		assert.match(markup, /Сообщение об ошибке/);
	});
});

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { notFoundRoute } from '#server/routes/__/404.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/404', () => {
	test('Returns 404 error page template', async () => {
		const { page } = await notFoundRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.strictEqual(page?.heading, 'Ошибка 404');
		assert.match(markup, /Страница не найдена/);
		assert.match(markup, /href="\/privacy"/);
	});
});

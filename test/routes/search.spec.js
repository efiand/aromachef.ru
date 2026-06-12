import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { searchRoute } from '#server/routes/search.js';
import { useDbTeardown } from '../_helpers/db-teardown.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/Search', () => {
	useDbTeardown();

	test('Returns search form without query', async () => {
		const { page } = await searchRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.strictEqual(page?.heading, 'Поиск рецептов');
		assert.match(markup, /class="search-form"/);
		assert.match(markup, /action="\/search"/);
	});

	test('Returns fragment template for async search', async () => {
		const { template } = await searchRoute.GET(createRouteParams({ body: { fragment: '', q: 'zzzznotfound99999' } }));

		assert.match(template ?? '', /Ничего не найдено/);
	});
});

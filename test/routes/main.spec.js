import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { mainRoute } from '#server/routes/main.js';
import { useDbTeardown } from '../_helpers/db-teardown.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/Main', () => {
	useDbTeardown();

	test('Returns home page with recipes section', async () => {
		const { page } = await mainRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.match(markup, /class="page-section/);
		assert.match(markup, /Новые рецепты с эфирными маслами/);
		assert.match(markup, /class="main-footer"/);
	});
});

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { aboutRoute } from '#server/routes/about.js';
import { useDbTeardown } from '../_helpers/db-teardown.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/About', () => {
	useDbTeardown();

	test('Returns about page with article section', async () => {
		const { page } = await aboutRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.match(markup, /class="page-section/);
		assert.match(markup, /\/images\/about/);
		assert.match(page?.description ?? '', /./);
	});
});

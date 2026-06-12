import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { importantRoute } from '#server/routes/important.js';
import { useDbTeardown } from '../_helpers/db-teardown.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/Important', () => {
	useDbTeardown();

	test('Returns important page with article section', async () => {
		const { page } = await importantRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.match(markup, /class="page-section/);
		assert.match(markup, /\/images\/important/);
		assert.ok(page?.heading);
	});
});

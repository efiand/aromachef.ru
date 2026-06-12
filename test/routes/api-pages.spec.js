import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { pagesApiRoute } from '#server/routes/api/pages.js';
import { useDbTeardown } from '../_helpers/db-teardown.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/Api/Pages', () => {
	useDbTeardown();

	test('Returns json list of public page urls', async () => {
		const { contentType, template } = await pagesApiRoute.GET(createRouteParams());
		const pages = JSON.parse(template ?? '[]');

		assert.strictEqual(contentType, 'application/json');
		assert.ok(Array.isArray(pages));
		assert.ok(pages.includes('/'));
		assert.ok(pages.includes('/privacy'));
		assert.ok(pages.includes('/structure'));
	});
});

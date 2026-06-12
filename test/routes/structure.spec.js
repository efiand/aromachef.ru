import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { structureRoute } from '#server/routes/structure.js';
import { useDbTeardown } from '../_helpers/db-teardown.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/Structure', () => {
	useDbTeardown();

	test('Returns structure and tags page', async () => {
		const { page } = await structureRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.strictEqual(page?.heading, 'Разделы и теги');
		assert.match(markup, /class="structure"/);
		assert.match(markup, /id="tags"/);
	});
});

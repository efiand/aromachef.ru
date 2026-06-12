import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { updateRoute } from '#server/routes/__/update.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/Update', () => {
	test('Returns maintenance page template', async () => {
		const { page } = await updateRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.strictEqual(page?.heading, 'Сайт обновляется');
		assert.match(markup, /Попробуйте обновить страницу/);
	});
});

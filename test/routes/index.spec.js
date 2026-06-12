import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { routes } from '#server/routes/index.js';
import { useDbTeardown } from '../_helpers/db-teardown.js';

describe('Routes/Index', () => {
	useDbTeardown();

	test('Registers public and service routes', () => {
		assert.ok(routes['/']?.GET);
		assert.ok(routes['/about']?.GET);
		assert.ok(routes['/important']?.GET);
		assert.ok(routes['/privacy']?.GET);
		assert.ok(routes['/search']?.GET);
		assert.ok(routes['/structure']?.GET);
		assert.ok(routes['/sitemap.xml']?.GET);
		assert.ok(routes['/__/404']?.GET);
		assert.ok(routes['/__/update']?.GET);
	});

	test('Registers admin and api routes', () => {
		assert.ok(routes['/admin']?.GET);
		assert.ok(routes['/admin/auth']?.GET);
		assert.ok(routes['/admin/recipe/:id']?.GET);
		assert.ok(routes['/api/pages']?.GET);
		assert.ok(routes['/recipe/:id']?.GET);
		assert.ok(routes['/blog/:id']?.GET);
	});
});

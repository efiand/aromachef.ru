import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { PROJECT_TITLE } from '#common/constants.js';
import { renderDocumentTitle } from '#common/templates/title.js';

describe('Templates/Title', () => {
	test('Joins heading and project title', () => {
		assert.strictEqual(renderDocumentTitle('Поиск'), `Поиск | ${PROJECT_TITLE}`);
	});

	test('Returns project title without heading', () => {
		assert.strictEqual(renderDocumentTitle(), PROJECT_TITLE);
	});
});

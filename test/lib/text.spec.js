import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { capitalize, highlight } from '#common/lib/text.js';

describe('Lib/Text', () => {
	test('capitalize uppercases first letter', () => {
		assert.strictEqual(capitalize('рецепт'), 'Рецепт');
		assert.strictEqual(capitalize(''), '');
	});

	test('highlight wraps query matches in mark', () => {
		assert.strictEqual(highlight('Молочный суп', 'Мол'), '<mark>Мол</mark>очный суп');
	});

	test('highlight escapes regexp special characters in query', () => {
		assert.strictEqual(highlight('test (value)', '(value)'), 'test <mark>(value)</mark>');
	});

	test('highlight returns original text without query', () => {
		assert.strictEqual(highlight('Суп', ''), 'Суп');
	});
});

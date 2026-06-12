import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { prepareText } from '#server/lib/prepare-text.js';

describe('Server/Prepare-text', () => {
	test('Removes script tags from html', () => {
		const result = prepareText('<script>alert(1)</script><p>Текст</p>');

		assert.doesNotMatch(result, /script/i);
		assert.match(result, /Текст/);
	});

	test('Adds rel noopener noreferrer to blank target links', () => {
		const result = prepareText('<a href="https://example.com" target="_blank">Ссылка</a>');

		assert.match(result, /rel="noopener noreferrer"/);
	});

	test('Returns plain text when clearTags is true', () => {
		const result = prepareText('<p>Текст <strong>рецепта</strong></p>', true);

		assert.strictEqual(result, 'Текст рецепта');
	});
});

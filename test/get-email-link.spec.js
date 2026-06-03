import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMAIL } from '#common/constants.js';
import { getEmailLink } from '#common/lib/get-email-link.js';

test('builds mailto link with subject only (%20 instead of +)', () => {
	const result = getEmailLink({
		subject: 'Hello world',
	});

	assert.strictEqual(result, `mailto:${EMAIL}?subject=Hello%20world`);
});

test('encodes unicode and quotes correctly', () => {
	const result = getEmailLink({
		subject: 'Отзыв на произведение «Тест»',
	});

	assert.strictEqual(
		result,
		`mailto:${EMAIL}?subject=%D0%9E%D1%82%D0%B7%D1%8B%D0%B2%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20%C2%AB%D0%A2%D0%B5%D1%81%D1%82%C2%BB`,
	);
});

test('adds body and encodes line breaks', () => {
	const result = getEmailLink({
		body: 'Line 1\nLine 2',
		subject: 'Test',
	});

	assert.strictEqual(result, `mailto:${EMAIL}?subject=Test&body=Line%201%0ALine%202`);
});

test('encodes special URL characters (&, ?, =)', () => {
	const result = getEmailLink({
		body: 'a=1&b=2',
		subject: 'Test & check?',
	});

	assert.strictEqual(result, `mailto:${EMAIL}?subject=Test%20%26%20check%3F&body=a%3D1%26b%3D2`);
});

test('supports emoji and non-latin characters', () => {
	const result = getEmailLink({
		subject: 'Hello 👋 世界',
	});

	assert.strictEqual(result, `mailto:${EMAIL}?subject=Hello%20%F0%9F%91%8B%20%E4%B8%96%E7%95%8C`);
});

test('uses custom email if provided', () => {
	const result = getEmailLink({
		email: 'test@example.com',
		subject: 'Hello',
	});

	assert.strictEqual(result, 'mailto:test@example.com?subject=Hello');
});

test('does not include body if undefined', () => {
	const result = getEmailLink({
		body: undefined,
		subject: 'Hello',
	});

	assert.strictEqual(result, `mailto:${EMAIL}?subject=Hello`);
});

test('does not include body if empty string', () => {
	const result = getEmailLink({
		body: '',
		subject: 'Hello',
	});

	assert.strictEqual(result, `mailto:${EMAIL}?subject=Hello`);
});

test('parameter order is stable (subject first, then body)', () => {
	const result = getEmailLink({
		body: 'B',
		subject: 'S',
	});

	assert.strictEqual(result, `mailto:${EMAIL}?subject=S&body=B`);
});

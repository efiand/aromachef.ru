import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { privacyRoute } from '#server/routes/privacy.js';
import { createRouteParams } from '../_helpers/route-params.js';

describe('Routes/Privacy', () => {
	test('Returns privacy policy with comment and metrika disclosures', async () => {
		const { page } = await privacyRoute.GET(createRouteParams());
		const markup = page?.pageTemplate ?? '';

		assert.match(markup, /Политика обработки персональных данных/);
		assert.match(markup, /отправке комментария/);
		assert.match(markup, /Публикация комментариев на сайте/);
		assert.match(markup, /152-ФЗ/);
		assert.match(markup, /серверные журналы/);
		assert.match(markup, /карту кликов и запись сессий/);
		assert.match(markup, /Яндекс\.Метрика/);
		assert.match(markup, /efiand@ya\.ru/);
		assert.match(markup, /datetime="\d{4}-\d{2}-\d{2}"/);
	});
});

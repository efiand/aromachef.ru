import { EMAIL } from '#common/constants.js';

/** @type {(params: EmailParams) => string} */
export function getEmailLink({ body, email = EMAIL, subject }) {
	const params = new URLSearchParams({ subject });
	if (body) {
		params.set('body', body);
	}
	return `mailto:${email}?${params.toString().replace(/\+/g, '%20')}`;
}

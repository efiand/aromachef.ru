import type { Handle } from '@sveltejs/kit';

import { AMP } from '$env/static/private';
import * as amp from '@sveltejs/amp';

async function handle({ event, resolve }: Parameters<Handle>[0]) {
	let buffer = '';

	return await resolve(event, {
		transformPageChunk({ done, html }) {
			if (!AMP) {
				return html;
			}

			buffer += html;

			if (!done) {
				return html;
			}

			return amp
				.transform(buffer)
				.replace('<html', '<html amp')
				.replace('@charset "UTF-8";', '')
				.replace(/<!--.*?-->/g, '');
		}
	});
}

export { handle };

import { BASE_AMP_DOMAIN, BASE_URL } from '@/lib/constants';

import type { RequestHandler } from './$types';

const TEMPLATE = `User-agent: *
Disallow: /admin/
Host: ${BASE_URL}
Sitemap: ${BASE_URL}/sitemap.xml

User-agent: Googlebot
Disallow: /turbo.rss
`;

const AMP_TEMPLATE = `
User-agent: Yandex
Disallow: /
`;

function GET({ url: { hostname } }: Parameters<RequestHandler>[0]) {
	return new Response(
		`${TEMPLATE}${hostname === BASE_AMP_DOMAIN ? AMP_TEMPLATE : ''}`,
		{ headers: { 'Content-Type': 'text/plain' } }
	);
}

export { GET };

import type { RequestHandler } from './$types';

function GET({ url: { hostname } }: Parameters<RequestHandler>[0]) {
	let body = `User-agent: *
Disallow: /admin/
Host: https://${hostname}
Sitemap: https://${hostname}/sitemap.xml
`;

	if (hostname === 'amp.aromachef.ru') {
		body += `
User-agent: Yandex
Disallow: /
`;
	}

	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}

export { GET };

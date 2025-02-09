import { toW3CDatetime } from '@/lib/date';
import { minifyInternal } from '@/lib/minify';
import { prisma } from '@/lib/prisma';

import type { RequestHandler } from './$types';

type SitemapCache = {
	[key: number]: SitemapItem & { lastRecipeId: number };
};

type SitemapItem = {
	changefreq?:
		| 'always'
		| 'daily'
		| 'hourly'
		| 'monthly'
		| 'never'
		| 'weekly'
		| 'yearly';
	lastmod?: string;
	page: string;
	priority?:
		| '0.0'
		| '0.1'
		| '0.2'
		| '0.3'
		| '0.4'
		| '0.5'
		| '0.6'
		| '0.7'
		| '0.8'
		| '0.9'
		| '1.0';
};

const BEGIN_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">`;

async function GET({ url: { hostname } }: Parameters<RequestHandler>[0]) {
	const structuresCache: SitemapCache = {};
	const tagsCache: SitemapCache = {};

	const recipes = await prisma.recipes.findMany({
		orderBy: { publishedAt: 'desc' },
		select: {
			id: true,
			publishedAt: true,
			structureId: true,
			tags: { select: { tagId: true } }
		},
		where: { published: true }
	});
	const lastRecipeMod = toW3CDatetime(recipes[0].publishedAt);

	const pages: SitemapItem[] = [
		{
			changefreq: 'weekly',
			lastmod: lastRecipeMod,
			page: hostname,
			priority: '0.8'
		},
		{ page: `${hostname}/structure`, priority: '0.8' },
		{ page: `${hostname}/important` },
		{ page: `${hostname}/about` }
	];

	let body = BEGIN_TEMPLATE;

	pages.forEach(function (page) {
		body += getItemTemplate(page);
	});
	recipes.forEach(function ({ id: recipeId, publishedAt, structureId, tags }) {
		const lastmod = toW3CDatetime(publishedAt);
		const cache = { lastmod, lastRecipeId: recipeId };

		// Обновление данных о разделе
		if (!structuresCache[structureId]) {
			structuresCache[structureId] = {
				...cache,
				page: `${hostname}/structure/${structureId}`
			};
		}

		// Обновление данных о тегах
		tags.forEach(function ({ tagId }) {
			if (!tagsCache[tagId]) {
				tagsCache[tagId] = {
					...cache,
					page: `${hostname}/tag/${tagId}`
				};
			}
		});

		body += getItemTemplate({
			changefreq: 'monthly',
			lastmod,
			page: `${hostname}/recipe/${recipeId}`,
			priority: '1.0'
		});
	});

	Object.values(structuresCache).forEach((item) => {
		body += getItemTemplate(item);
	});
	Object.values(tagsCache).forEach((item) => {
		body += getItemTemplate(item);
	});

	body += '</urlset>';

	return new Response(minifyInternal(body), {
		headers: { 'Content-Type': 'application/xml' }
	});
}

function getItemTemplate({
	changefreq,
	lastmod,
	page,
	priority = '0.5'
}: SitemapItem) {
	return `
		<url>
			<loc>https://${page}</loc>
			<priority>${priority}</priority>
			${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
			${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
		</url>
	`;
}

export { GET };

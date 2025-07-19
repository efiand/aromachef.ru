import { PUBLISHED_QUERY } from '@/lib/constants';
import { correctZone, daysInMonth, toDays, toW3CDatetime } from '@/lib/date';
import { minifyInternal } from '@/lib/minify';
import { prisma } from '@/lib/prisma';

import type { RequestHandler } from './$types';

type Changefreq =
	| ''
	| 'always'
	| 'daily'
	| 'hourly'
	| 'monthly'
	| 'never'
	| 'weekly'
	| 'yearly';

type SitemapCache = {
	[key: number]: SitemapItem & { lastRecipeId: number };
};

type SitemapItem = {
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
	updatedAt?: Date;
};

const BEGIN_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">`;

async function GET({ url: { hostname } }: Parameters<RequestHandler>[0]) {
	const structuresCache: SitemapCache = {};
	const tagsCache: SitemapCache = {};

	const recipes = await prisma.recipes.findMany({
		orderBy: { updatedAt: 'desc' },
		select: {
			id: true,
			structureId: true,
			tags: { select: { tagId: true } },
			updatedAt: true
		},
		where: PUBLISHED_QUERY
	});

	const pages: SitemapItem[] = [
		{
			page: hostname,
			priority: '0.8',
			updatedAt: recipes[0].updatedAt
		},
		{ page: `${hostname}/structure`, priority: '0.8' },
		{ page: `${hostname}/important` },
		{ page: `${hostname}/about` }
	];

	let body = BEGIN_TEMPLATE;

	pages.forEach(function (page) {
		body += getItemTemplate(page);
	});
	recipes.forEach(function ({ id: recipeId, structureId, tags, updatedAt }) {
		const cache = { lastRecipeId: recipeId, updatedAt };

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
			page: `${hostname}/recipe/${recipeId}`,
			priority: '1.0',
			updatedAt
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

function getItemTemplate({ page, priority = '0.5', updatedAt }: SitemapItem) {
	let lastmod = '';
	let changefreq: Changefreq = '';

	if (updatedAt) {
		const realUpdatedAt = correctZone(updatedAt);
		lastmod = toW3CDatetime(realUpdatedAt);
		const diffInDays = toDays(Date.now() - realUpdatedAt.valueOf());

		if (diffInDays > daysInMonth()) {
			changefreq = 'yearly';
		} else if (diffInDays > 7) {
			changefreq = 'monthly';
		} else if (diffInDays > 1) {
			changefreq = 'weekly';
		} else {
			changefreq = 'daily';
		}
	}

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

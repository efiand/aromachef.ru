import type { Recipe } from '@/types';

import { aboutData } from '@/data/about';
import { importantData } from '@/data/important';
import { getEnrichedRecipe, getSimpleRecipeTemplate } from '@/data/recipe';
import {
	BASE_AMP_DOMAIN,
	BASE_URL,
	BEGIN_DATE,
	PROJECT_NAME,
	PUBLISHED_QUERY
} from '@/lib/constants';
import { toRFC822 } from '@/lib/date';
import { html } from '@/lib/make-template';
import { minifyInternal } from '@/lib/minify';
import { prisma } from '@/lib/prisma';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

type Page = typeof aboutData;

async function GET({ url: { hostname } }: Parameters<RequestHandler>[0]) {
	if (hostname === BASE_AMP_DOMAIN) {
		error(
			404,
			`Турбо-страницы канонической версии сайта находятся по адресу: ${BASE_URL}/turbo.rss.`
		);
	}

	const recipes = (await prisma.recipes.findMany({
		select: {
			cooking: true,
			description: true,
			id: true,
			ingredients: true,
			publishedAt: true,
			telegramId: true,
			title: true
		},
		where: PUBLISHED_QUERY
	})) as Recipe[];

	const pages: Page[] = [aboutData, importantData];

	function mapPage({ content, page, publishedAt, title }: Page): string {
		return `
			<item turbo="true">
				<turbo:extendedHtml>true</turbo:extendedHtml>
				<link>${BASE_URL}/${page}</link>
				<turbo:content>
					<![CDATA[${html`
						<header><h1>${title}</h1></header>
					`}${content}]]>
				</turbo:content>
				<pubDate>${toRFC822(publishedAt)}</pubDate>
			</item>
		`;
	}

	function mapRecipePage(recipe: Recipe): string {
		const enrichedRecipe = getEnrichedRecipe(recipe);
		const { description, id, publishedAt, title } = enrichedRecipe;

		return mapPage({
			content: getSimpleRecipeTemplate(enrichedRecipe),
			description,
			page: `recipe/${id}`,
			publishedAt: publishedAt || BEGIN_DATE,
			title
		});
	}

	const body = minifyInternal(`
		<?xml version="1.0" encoding="UTF-8" ?>
		<rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" xmlns:turbo="http://turbo.yandex.ru" version="2.0">
			<channel>
				<title>${PROJECT_NAME}</title>
				<link>${BASE_URL}</link>
				<description>Быстрые, вкусные и полезные рецепты с эфирными маслами.</description>
				<language>ru</language>
				${pages.map(mapPage).join('')}
				${recipes.map(mapRecipePage).join('')}
			</channel>
		</rss>
	`);

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}

export { GET };

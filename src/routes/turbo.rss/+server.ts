import { aboutData } from '@/data/about';
import { importantData } from '@/data/important';
import { BASE_URL, BEGIN_DATE } from '@/lib/constants';
import { toRFC822 } from '@/lib/date';
import { html } from '@/lib/make-template';
import { minifyInternal } from '@/lib/minify';
import { prepareRecipe } from '@/lib/prepare-data';
import { prisma } from '@/lib/prisma';

type Page = typeof aboutData;

async function GET() {
	const recipes = await prisma.recipes.findMany({
		select: {
			cooking: true,
			description: true,
			id: true,
			ingredients: true,
			publishedAt: true,
			telegramId: true,
			title: true
		},
		where: { published: true }
	});

	const pages: Page[] = [
		aboutData,
		importantData,
		...recipes.map(function (recipe) {
			const {
				cooking,
				description,
				enrichedDescription,
				id,
				ingredients,
				publishedAt,
				title
			} = prepareRecipe(recipe);
			return {
				content: html`
					${enrichedDescription}
					<h2>Состав</h2>
					${ingredients}
					<h2>Приготовление</h2>
					${cooking}
				`,
				description,
				page: `recipe/${id}`,
				publishedAt: publishedAt || BEGIN_DATE,
				title
			};
		})
	];

	function mapPages({ content, page, publishedAt, title }: Page) {
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

	const body = minifyInternal(`
		<?xml version="1.0" encoding="UTF-8" ?>
		<rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" xmlns:turbo="http://turbo.yandex.ru" version="2.0">
			<channel>
				<title>АромаШеф</title>
				<link>${BASE_URL}</link>
				<description>Быстрые, вкусные и полезные рецепты с эфирными маслами.</description>
				<language>ru</language>
				${pages.map(mapPages).join('')}
			</channel>
		</rss>
	`);

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}

export { GET };

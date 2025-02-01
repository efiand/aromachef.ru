import { BASE_URL } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

async function GET() {
	const [recipes, tags] = await Promise.all([
		prisma.recipes.findMany({
			select: { id: true, structureId: true },
			where: { published: true }
		}),
		prisma.tags.findMany({
			select: { id: true },
			where: { recipes: { some: { recipe: { published: true } } } }
		})
	]);

	const pages: string[] = [
		'',
		'about',
		'important',
		'structure',
		...tags.map(({ id }) => `tag/${id}`)
	];
	const uniqueStructures = new Set<string>([]);

	recipes.forEach(({ id, structureId }) => {
		pages.push(`recipe/${id}`);
		uniqueStructures.add(`structure/${structureId}`);
	});
	pages.push(...uniqueStructures);

	const body = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
	xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="https://www.w3.org/1999/xhtml"
>${pages
		.map(
			(page) => `
	<url>
		<loc>${BASE_URL}/${page}</loc>
	</url>`
		)
		.join('')}
</urlset>`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}

export { GET };

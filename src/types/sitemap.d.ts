declare global {
	type Changefreq = 'daily' | 'monthly' | 'weekly' | 'yearly' | undefined;

	type SitemapPage = {
		lastmod?: string;
		loc: string;
		priority?: string;
	};
}

export {};

declare global {
	type Changefreq = "daily" | "weekly" | "monthly" | "yearly" | undefined;

	type SitemapPage = {
		lastmod?: string;
		loc: string;
		priority?: string;
	};
}

export {};

declare global {
	import type { IncomingMessage, ServerResponse } from "node:http";

	namespace NodeJS {
		interface ProcessEnv {
			DB_HOST: string;
			DB_NAME: string;
			DB_PASSWORD: string;
			DB_USER: string;
			DEV?: string;
			PORT: string;
			YADISK_TOKEN: string;
		}
	}

	type ArticleData = {
		alt?: string;
		content?: string;
		imageAlias: string;
		reverse?: boolean;
		title?: string;
	};

	type DbItem = {
		id: number;
		title: string;
	};

	type CardAdditionals = {
		alt?: string;
		picturesHost?: string;
		route?: string;
	};

	type CardsData = CardAdditionals & {
		cards?: DbItem[];
		centered?: boolean;
		className?: string;
	};

	type Changefreq = "daily" | "weekly" | "monthly" | "yearly" | undefined;

	type ComponentInitiator = (element: HTMLElement) => void;

	type DbTable = "recipes" | "recipesRecipes" | "recipesTags" | "staticPages" | "structures" | "tags";

	type LayoutData = {
		isAmp?: boolean;
		description: string;
		headTemplate?: string;
		heading?: string;
		ogImage?: string;
		pageTemplate?: string;
		pathname?: string;
	};

	type PageSectionData = {
		articles?: ArticleData[];
		content?: string;
		footerTemplate?: string;
		next?: string;
		prev?: string;
		title: string;
	};

	type Recipe = {
		cooking: string;
		description: string;
		ingredients: string;
		structureId: number;
		structureTitle: string;
		telegramId?: number | null;
		title: string;
	};

	type RecipeFooter = {
		picturesHost?: string;
		relatedRecipes?: DbItem[];
		structure: DbItem;
		tags: DbItem[];
	};

	type Route = {
		[method: IncomingMessage["method"]]: RouteMethod;
	};

	type RouteData = {
		contentType?: string;
		page?: LayoutData;
		template?: string;
	};

	type RouteMethod = (params: RouteParams) => Promise<RouteData>;

	type RouteParams = {
		body: Record<string, string>;
		id: number;
		req: RouteRequest;
		res: RouteResponse;
	};

	type RouteRequest = IncomingMessage;

	type RouteResponse = ServerResponse<IncomingMessage> & { req: IncomingMessage };

	type ServerMiddleware = (req: IncomingMessage, res: RouteResponse, next?: ServerMiddleware) => Promise<void>;

	type SitemapPage = {
		lastmod?: string;
		loc: string;
		priority?: string;
	};

	type StaticPageData = {
		content: string;
		description: string;
		heading: string;
	};

	type Stylesheet = {
		name: string;
		media?: string;
	};

	type TagTemplateData = {
		className?: string;
		column?: boolean;
		tags: DbItem[];
	};

	type TurboPage = {
		content: string;
		description: string;
		link: string;
		pubDate: string;
		telegramId: number | null;
		title: string;
	};
}

export {};

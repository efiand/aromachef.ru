import type { IncomingMessage, ServerResponse } from "node:http";

declare global {
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
		centered?: boolean;
		cards?: DbItem[];
	};

	type Changefreq = "daily" | "weekly" | "monthly" | "yearly" | undefined;

	type DbTable = "recipes" | "recipesTags" | "staticPages" | "structures" | "tags";

	type LayoutData = {
		description: string;
		heading?: string;
		headTemplate?: string;
		ogImage?: string;
		pageTemplate?: string;
		pathname?: string;
	};

	type PageSectionData = {
		articles?: ArticleData[];
		content?: string;
		footerTemplate?: string;
		title: string;
	};

	type Render<Data = object> = (data: Data) => string;

	type Recipe = {
		cooking: string;
		description: string;
		ingredients: string;
		title: string;
		structureId: number;
		structureTitle: string;
		telegramId?: number | null;
	};

	type Route = {
		[method: IncomingMessage["method"]]: RouteMethod;
	};

	type RouteData = {
		json?: object;
		xml?: string;
		page?: LayoutData;
		template?: string;
	};

	type RouteMethod = (params: RouteParams) => Promise<RouteData>;

	type RouteParams = {
		body: object;
		id: number;
		req: RouteRequest;
		res: RouteResponse;
		url: URL;
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
		heading: string;
		description: string;
		content: string;
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

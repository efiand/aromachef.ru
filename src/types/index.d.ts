declare global {
	import type { IncomingMessage, ServerResponse } from "node:http";
	import type formidable from "formidable";

	declare const PetiteVue: {
		createApp: (data?: object | (() => object)) => { mount(HTMLElement): void };
		reactive: <T extends object>(obj: T) => T;
		nextTick(cb: () => void): void;
		watchEffect(effect: () => void): void;
	};

	interface Window {
		isDev?: boolean;
	}

	namespace NodeJS {
		interface ProcessEnv {
			DB_HOST: string;
			DB_NAME: string;
			DB_PASSWORD: string;
			DB_USER: string;
			DEV?: string;
			PORT: string;
			TG_ADMIN_ID: string;
			TG_AROMACHEF_ID: string;
			TG_TOKEN: string;
			YADISK_TOKEN: string;
		}
	}

	type ArticleData = {
		isAmp?: boolean;
		alt?: string;
		content?: string;
		imageAlias: string;
		reverse?: boolean;
		title?: string;
	};

	type CardAdditionals = {
		isAmp?: boolean;
		alt?: string;
		route?: string;
	};

	type CardsData = CardAdditionals & {
		cards?: DbItem[];
		className?: string;
	};

	type Changefreq = "daily" | "weekly" | "monthly" | "yearly" | undefined;

	type ComponentInitiator = (element: HTMLElement) => void | Promise<void>;

	type DbItem = {
		current?: boolean;
		id: number;
		title: string;
	};

	type DbTable = "comments" | "recipes" | "recipesRecipes" | "recipesTags" | "staticPages" | "structures" | "tags";

	type ImageParams = {
		alt: string;
		imageAlias: string;
		isAmp?: boolean;
		height: number;
		width: number;
	};

	type LayoutDataBase = {
		isAmp?: boolean;
		isDev?: boolean;
		pageTemplate?: string;
		pathname?: string;
	};

	type LayoutData = LayoutDataBase & {
		description: string;
		headTemplate?: string;
		heading?: string;
		ogImage?: string;
	};

	type PageSectionData = {
		articles?: ArticleData[];
		className?: string;
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
		ingredientsExtra: string | null;
		structureId: number;
		structureTitle: string;
		telegramId?: number | null;
		title: string;
	};

	type RecipeComment = {
		id: number;
		name: string;
		text: string;
		answer: string | null;
	};

	type RecipeFooter = {
		isAmp?: boolean;
		relatedRecipes?: DbItem[];
		structure: DbItem;
		tags: DbItem[];
	};

	type ReqBody = Record<formidable.Files<string> | object | string>;

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
		body: ReqBody;
		id: number;
		isAmp: boolean;
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

	type StructureData = {
		alt?: string;
		asideHeading: string;
		asideId?: string;
		cards: DbItem[];
		heading: string;
		isAmp?: boolean;
		route?: string;
		structures?: DbItem[];
		tags?: DbItem[];
	};

	type TagTemplateData = {
		className?: string;
		column?: boolean;
		tags: DbItem[];
	};

	type TelegramPayload = {
		chat?: {
			id?: string | number;
			username?: string;
		};
		text: string;
	};
}

export {};

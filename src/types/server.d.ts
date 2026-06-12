import type { IncomingMessage, ServerResponse } from 'node:http';

declare global {
	type AppDispatch = (req?: IncomingMessage, res?: RouteResponse) => void | Promise<void>;

	type AppNextOptions = {
		isQuiet?: boolean;
	};

	type CreateAppOptions = {
		isQuiet?: boolean;
		middleware?: ServerMiddleware;
		port?: number;
	};

	type CookieBody = {
		domain?: string;
		expires?: Date;
		httpOnly?: boolean;
		maxAge?: string | number;
		name: string;
		path?: string;
		sameSite?: 'Lax' | 'None' | 'Strict';
		secure?: boolean;
		value: string;
	};

	type DbPlaceholder = DbPlaceholder[] | null | number | string;

	type ErrorHandler = (params: {
		error: unknown;
		isAdmin?: boolean;
		isAuthorized?: boolean;
		isQuiet?: boolean;
		url: URL;
	}) => Promise<{ statusCode: number; template: string }>;

	type PageCache = {
		contentType: string;
		template: string;
	};

	type ReqBody = Record<string, unknown>;

	type Route = Record<string, RouteMethod>;

	type RouteData = {
		contentType?: string;
		page?: LayoutData;
		redirect?: string;
		statusCode?: number;
		template?: string;
	};

	type RouteMethod = (params: RouteParams) => Promise<RouteData>;

	type RouteParams = {
		body: ReqBody;
		id: number;
		isAuthorized: boolean;
		req: RouteRequest;
		res: RouteResponse;
	};

	type RouteRequest = IncomingMessage;

	type RouteResponse = ServerResponse<IncomingMessage> & { req: IncomingMessage };

	type ServerMiddleware = (req: IncomingMessage, res: RouteResponse, next?: AppDispatch) => Promise<void>;
}

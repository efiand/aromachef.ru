declare global {
	import type { IncomingMessage, ServerResponse } from "node:http";

	type CookieBody = {
		name: string;
		value: string;
		domain?: string;
		expires?: Date;
		maxAge?: string | number;
		path?: string;
		httpOnly?: boolean;
		secure?: boolean;
		sameSite?: "Lax" | "None" | "Strict";
	};

	type ReqBody = Record<string, unknown>;

	type Route = {
		[method: IncomingMessage["method"]]: RouteMethod;
	};

	type RouteData = {
		redirect?: string;
		statusCode?: number;
		contentType?: string;
		page?: LayoutData;
		template?: string;
	};

	type RouteMethod = (params: RouteParams) => Promise<RouteData>;

	type RouteParams = {
		authorized: boolean;
		body: ReqBody;
		id: number;
		isAmp: boolean;
		req: RouteRequest;
		res: RouteResponse;
	};

	type RouteRequest = IncomingMessage;

	type RouteResponse = ServerResponse<IncomingMessage> & { req: IncomingMessage };

	type ServerMiddleware = (req: IncomingMessage, res: RouteResponse, next?: ServerMiddleware) => Promise<void>;

	type TelegramPayload = {
		chat?: {
			id?: string | number;
			username?: string;
		};
		text: string;
	};
}

export {};

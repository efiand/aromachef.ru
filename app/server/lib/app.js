import { createServer } from "node:http";
import jwt from "jsonwebtoken";
import { log } from "#common/lib/log.js";
import { noAmp } from "#common/lib/no-amp.js";
import { renderErrorPage } from "#common/templates/error-page.js";
import { host, isDev, port } from "#server/constants.js";
import { getCookies } from "#server/lib/cookies.js";
import { closeDbPool } from "#server/lib/db.js";
import { renderPage } from "#server/lib/page.js";
import { getPageFromCache, recordPagesCache } from "#server/lib/pages-cache.js";
import { getRequestBody } from "#server/lib/request.js";
import { routes } from "#server/routes/index.js";

/** @type {(error: unknown, url: URL, authorized?: boolean) => Promise<{ statusCode: number; template: string }>} */
async function handleError(error, { href, pathname }, authorized = false) {
	let message = "На сервере произошла ошибка.";
	let statusCode = 500;
	if (error instanceof Error) {
		if (typeof error.cause === "number") {
			statusCode = error.cause;
		}
		if (isDev || statusCode !== 500) {
			({ message } = error);
		}
	}

	if (!pathname?.startsWith("/__")) {
		log.error(`❌ [HTTP ERROR ${statusCode} | ${href}]`, error);
	}

	const heading = `Ошибка ${statusCode}`;
	const template = await renderPage({
		authorized,
		description: "Страница ошибок.",
		heading,
		pageTemplate: renderErrorPage(heading, message),
		pathname,
	});

	return { statusCode, template };
}

/** @type {ServerMiddleware} */
async function next(req, res) {
	const { method = "GET" } = req;
	const url = new URL(`${host}${req.url}`);
	const isAmp = url.pathname === "/amp" || url.pathname.startsWith("/amp/");
	const isAdmin = url.pathname === "/admin" || url.pathname.startsWith("/admin/");
	const isApi = url.pathname.startsWith("/api/");
	const pathname = url.pathname === "/amp" ? "/" : url.pathname.replace(/^\/amp\//, "/");
	const [, rawRouteName = "", rawId, rawIdInApi] = pathname.split("/");
	const id = Number(isApi || isAdmin ? rawIdInApi : rawId);

	let routeName = rawRouteName;
	if (isApi) {
		routeName = `api/${rawId}`;
	} else if (isAdmin) {
		routeName = `admin/${rawId}`;
	}

	const routeKey = Number.isNaN(id) ? pathname : `/${routeName}/:id`;
	const route = routes[routeKey];

	let contentType = "text/html; charset=utf-8";
	let template = "";
	let redirect = "";
	let statusCode = 200;
	let authorized = false;

	try {
		const { authToken } = getCookies(req);
		authorized = Boolean(authToken && jwt.verify(authToken, process.env.AUTH_SECRET));

		if (!route) {
			throw new Error("Страница не найдена.", { cause: 404 });
		}

		if (isAmp && noAmp(routeKey)) {
			throw new Error("Страница не имеет AMP-версии.", { cause: 404 });
		}

		if (!route[method]) {
			if (method === "HEAD" && route.GET) {
				route.HEAD = route.GET;
			} else {
				throw new Error("Method not allowed!", { cause: 405 });
			}
		}

		if (isAdmin && pathname !== "/admin/auth" && !authorized) {
			res.statusCode = 302;
			res.setHeader("Location", "/admin/auth");
			res.end();
			return;
		}

		const body = await getRequestBody(req);
		const isCanonical = Object.keys(body).length === 0;
		const isFragment = Object.keys(body).length === 1 && body.fragment !== undefined;
		const needCache = !authorized && !isAdmin && (isCanonical || isFragment);

		/** @type {PageCache | null} */
		let cache = null;
		if (needCache) {
			if (isCanonical) {
				cache = getPageFromCache(url.pathname);
			} else if (isFragment) {
				cache = getPageFromCache(url.pathname, true);
			}
		}

		if (cache) {
			({ contentType, template } = cache);
		} else {
			const routeData = await route[method]({ authorized, body, id, isAmp, req, res });
			({ contentType = "text/html; charset=utf-8", redirect = "", statusCode = 200, template = "" } = routeData);

			if (routeData.page) {
				template = await renderPage({ ...routeData.page, authorized, isAmp, pathname });
			}

			if (needCache) {
				recordPagesCache(url.pathname, { contentType, template }, isFragment);
			}
		}
	} catch (error) {
		({ statusCode, template } = await handleError(error, url, authorized));
	}

	if (redirect) {
		if (statusCode === 200) {
			statusCode = 302;
		}
		res.setHeader("Location", redirect);
	} else {
		res.setHeader("Content-Type", contentType);
	}
	res.statusCode = statusCode;
	res.end(method === "HEAD" ? "" : template);
}

/** @type {(middleware?: ServerMiddleware) => import("node:http").Server} */
export function createApp(middleware) {
	const server = createServer((req, res) => {
		if (middleware) {
			middleware(req, res, next);
		} else {
			next(req, res);
		}
	});

	server.listen(port, "localhost", () => {
		log.info(`✅ Сервер запущен по адресу: ${host}`);
	});

	return server;
}

/** @type {(server?: import("node:http").Server) => Promise<void>} */
export async function closeApp(server) {
	try {
		if (server) {
			await new Promise((resolve, reject) => {
				server.close((err) => (err ? reject(err) : resolve("")));
			});
		}

		await closeDbPool();
	} catch (error) {
		log.error("❌ [CLOSING ERROR]", error);
	}
}

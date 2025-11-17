import { createServer } from "node:http";
import jwt from "jsonwebtoken";
import { noAmp } from "#common/lib/no-amp.js";
import { renderErrorPage } from "#common/templates/errorPage.js";
import { host, isDev, port } from "#server/constants.js";
import { getCookies } from "#server/lib/cookies.js";
import { renderPage } from "#server/lib/page.js";
import { getRequestBody } from "#server/lib/request.js";
import { routes } from "#server/routes/index.js";

/** @type {(error: unknown, href: string) => Promise<{ statusCode: number; template: string }>} */
async function handleError(error, href) {
	if (!isDev) {
		console.error(error, `[${href}]`);
	}

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

	const heading = `Ошибка ${statusCode}`;
	const template = await renderPage({
		description: "Страница ошибок.",
		heading,
		pageTemplate: renderErrorPage(heading, message),
	});

	return { statusCode, template };
}

/** @type {ServerMiddleware} */
async function next(req, res) {
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

	try {
		if (!route) {
			throw new Error("Страница не найдена.", { cause: 404 });
		}

		if (isAmp && noAmp(routeKey)) {
			throw new Error("Страница не имеет AMP-версии.", { cause: 404 });
		}

		const { method = "GET" } = req;
		if (!route[method]) {
			throw new Error("Method not allowed!", { cause: 405 });
		}

		const { authToken } = getCookies(req);
		const authorized = Boolean(authToken && jwt.verify(authToken, process.env.AUTH_SECRET));

		if (isAdmin && pathname !== "/admin/auth" && !authorized) {
			res.statusCode = 302;
			res.setHeader("Location", "/admin/auth");
			res.end();
			return;
		}

		const body = await getRequestBody(req);
		const routeData = await route[method]({ authorized, body, id, isAmp, req, res });
		({ contentType = "text/html; charset=utf-8", redirect = "", statusCode = 200, template = "" } = routeData);

		if (routeData.page) {
			template = await renderPage({ ...routeData.page, authorized, isAmp, pathname });
		}
	} catch (error) {
		({ statusCode, template } = await handleError(error, url.href));
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
	res.end(template.trim());
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
		console.info(`Сервер запущен по адресу: ${host}`);
	});

	return server;
}

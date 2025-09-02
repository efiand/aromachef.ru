import { createServer } from "node:http";
import { html } from "#!/common/utils/mark-template.js";
import { host, isDev, port } from "#!/server/constants.js";
import { renderPage } from "#!/server/lib/page.js";
import { getRequestBody } from "#!/server/lib/request.js";
import { noAmpRoutes, routes } from "#!/server/routes/index.js";

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
		pageTemplate: html`
			<div class="content">
				<h1>${heading}</h1>
				<p>${message}</p>
				<p><a href="mailto:efiand@ya.ru?subject=aromachef">Свяжитесь с разработчиком</a> или напишите в <a href="https://t.me/aroma_chef_bot">telegram-бот</a>.</p>
			</div>
		`,
	});

	return { statusCode, template };
}

/** @type {ServerMiddleware} */
async function next(req, res) {
	const url = new URL(`${host}${req.url}`);
	const isAmp = url.pathname === "/amp" || /^\/amp\//.test(url.pathname);
	const isApi = /^\/api\//.test(url.pathname);
	const pathname = url.pathname === "/amp" ? "/" : url.pathname.replace(/^\/amp\//, "/");
	const [, routeName = "", rawId, rawIdInApi] = pathname.split("/");
	const id = Number(isApi ? rawIdInApi : rawId);
	const routeKey = Number.isNaN(id) ? pathname : `/${isApi ? `api/${rawId}` : routeName}/:id`;
	const route = routes[routeKey];

	let contentType = "text/html; charset=utf-8";
	let template = "";
	let statusCode = 200;

	try {
		if (!route) {
			throw new Error("Страница не найдена.", { cause: 404 });
		}

		if (isAmp && noAmpRoutes.has(routeKey)) {
			throw new Error("Страница не имеет AMP-версии.", { cause: 404 });
		}

		const { method = "GET" } = req;
		if (!route[method]) {
			throw new Error("Method not allowed!", { cause: 405 });
		}

		const body = await getRequestBody(req);
		const routeData = await route[method]({ body, id, isAmp, req, res });
		({ contentType = "text/html; charset=utf-8", template = "" } = routeData);

		if (routeData.page) {
			template = await renderPage({ ...routeData.page, isAmp, pathname });
		}
	} catch (error) {
		({ statusCode, template } = await handleError(error, url.href));
	}

	res.statusCode = statusCode;
	res.setHeader("Content-Type", contentType);
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

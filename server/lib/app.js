import { createServer } from "node:http";
import { html } from "#!/utils/mark-template.js";
import { host, isDev, port } from "#server/constants.js";
import { renderLayout } from "#server/lib/layout.js";
import { noAmpRoutes, routes } from "#server/routes/index.js";

/** @type {(error: unknown, href: string) => Promise<{ statusCode: number; template: string }>} */
async function handleError(error, href) {
	if (isDev) {
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
	const template = await renderLayout({
		description: "Страница ошибок.",
		heading,
		pageTemplate: html`
			<div class="content">
				<h1>${heading}</h1>
				<p>${message}</p>
				<p><a href="mailto:efiand@ya.ru?subject=aromachef">Связаться с разработчиком</a></p>
			</div>
		`,
	});

	return { statusCode, template };
}

/** @type {(req: RouteRequest) => Promise<object>} */
function getRequestBody(req) {
	return new Promise((resolve, reject) => {
		if (req.method === "GET") {
			resolve({});
			return;
		}

		/** @type {Uint8Array<ArrayBufferLike>[]} */
		const chuncks = [];
		req
			.on("error", (error) => {
				reject(error);
			})
			.on("data", (chunk) => {
				chuncks.push(chunk);
			})
			.on("end", () => {
				/** @type {string} */
				const body = Buffer.concat(chuncks).toString();

				/** @type {Record<string, string>} */
				const data = {};

				for (const [name, value] of new URLSearchParams(body)) {
					data[name] = value;
				}

				resolve(data);
			});
	});
}

/** @type {ServerMiddleware} */
async function next(req, res) {
	const url = new URL(`${host}${req.url}`);
	const isAmp = url.pathname === "/amp" || /^\/amp\//.test(url.pathname);
	const pathname = url.pathname === "/amp" ? "/" : url.pathname.replace(/^\/amp\//, "/");
	const [, routeName = "", rawId] = pathname.split("/");
	const id = Number(rawId);
	const routeKey = Number.isNaN(id) ? pathname : `/${routeName}/:id`;
	const route = routes[routeKey];

	let contentType = "text/html";
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
		const routeData = await route[method]({ body, id, req, res, url });
		({ contentType = "text/html", template = "" } = routeData);

		if (routeData.page) {
			template = await renderLayout({ ...routeData.page, isAmp, pathname });
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

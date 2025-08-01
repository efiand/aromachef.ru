import { createServer } from "node:http";
import { html } from "#!/utils/mark-template.js";
import { host, isDev, port } from "#server/constants.js";
import { renderLayout } from "#server/lib/layout.js";
import { routes } from "#server/routes/index.js";

/** @type {(error: unknown) => { statusCode: number; template: string }} */
function handleError(error) {
	if (isDev) {
		console.error(error);
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

	return {
		statusCode,
		template: renderLayout({
			description: "Страница ошибок.",
			heading,
			pageTemplate: html`
			<div class="content">
				<h1>${heading}</h1>
				<p>${message}</p>
				<p><a href="mailto:efiand@ya.ru?subject=aromachef">Связаться с разработчиком</a></p>
			</div>
		`,
		}),
	};
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
	const pathname = url.pathname.replace("/amp", "") || "/";
	const [, routeName = "", rawId] = pathname.split("/");
	const routeKey = `/${routeName}${rawId ? `/:id` : ""}`;
	const route = routes[routeKey] || routes[pathname];
	const id = Number(rawId);

	let contentType = "text/html";
	let template = "";
	let statusCode = 200;

	try {
		if (!route) {
			throw new Error("Страница не найдена.", { cause: 404 });
		}

		if (!routes[pathname] && Number.isNaN(id)) {
			throw new Error("Идентификатор должен быть числом.", { cause: 400 });
		}

		const { method = "GET" } = req;
		if (!route[method]) {
			throw new Error("Method not allowed!", { cause: 405 });
		}

		const body = await getRequestBody(req);
		const routeData = await route[method]({ body, id, req, res, url });
		({ contentType = "text/html", template = "" } = routeData);

		if (routeData.page) {
			routeData.page.pathname = url.pathname;
			template = renderLayout(routeData.page);
		}
	} catch (error) {
		({ statusCode, template } = handleError(error));
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

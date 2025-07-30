import { createServer } from "node:http";
import { html } from "#!/utils/mark-template.js";
import { isDev, port } from "#server/constants.js";
import { renderLayout } from "#server/lib/layout.js";
import { routes } from "#server/routes/index.js";

const HOST = "localhost";

/** @type {(reasonPhrase: string, statusCode?: number) => LayoutData} */
function createErrorPage(reasonPhrase, statusCode = 404) {
	const heading = `Ошибка ${statusCode}`;
	return {
		description: "Страница ошибок.",
		heading,
		pageTemplate: html`
			<div class="content">
				<h1>${heading}</h1>
				<p>${reasonPhrase}</p>
				<p><a href="mailto:efiand@ya.ru?subject=aromachef">Связаться с разработчиком</a></p>
			</div>
		`,
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

/** @type {(res: RouteResponse, layoutData: LayoutData) => Promise<void>} */
async function sendLayout(res, layoutData) {
	res.setHeader("Content-Type", "text/html");
	res.end(renderLayout(layoutData));
}

/** @type {ServerMiddleware} */
async function next(req, res) {
	const url = new URL(`http://localhost${req.url}`);
	const [, routeName = "", rawId] = url.pathname.split("/");
	const routeKey = `/${routeName}${rawId ? `/:id` : ""}`;
	const route = routes[routeKey];
	const id = Number(rawId);

	if (!route || (rawId && Number.isNaN(id))) {
		res.statusCode = 404;
		sendLayout(res, createErrorPage("Страница не найдена."));
		return;
	}

	const { method = "GET" } = req;
	if (!route[method]) {
		res.statusCode = 405;
		sendLayout(res, createErrorPage("Method not allowed!", 405));
		return;
	}

	try {
		const body = await getRequestBody(req);
		const routeData = await route[method]({ body, id, req, res, url });

		if (routeData.xml) {
			res.setHeader("Content-Type", "application/xml");
			res.end(routeData.xml.trim());
			return;
		}

		if (routeData.json) {
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(routeData.json));
			return;
		}

		if (routeData.page) {
			routeData.page.pathname = url.pathname;
			sendLayout(res, routeData.page);
			return;
		}

		res.setHeader("Content-Type", "text/html");
		res.end(routeData.template || "");
	} catch (error) {
		let message = "На сервере произошла ошибка.";
		let statusCode = 500;
		if (error instanceof Error) {
			if (isDev) {
				({ message } = error);
			}
			if (typeof error.cause === "number") {
				statusCode = error.cause;
			}
		}
		if (isDev) {
			console.error(error);
		}
		res.statusCode = statusCode;
		sendLayout(res, createErrorPage(message, res.statusCode));
	}
}

/** @type {(middleware?: ServerMiddleware) => void} */
export function createApp(middleware) {
	const server = createServer((req, res) => {
		if (middleware) {
			middleware(req, res, next);
		} else {
			next(req, res);
		}
	});

	server.listen(port, HOST, () => {
		console.info(`Сервер запущен по адресу: http://${HOST}:${port}`);
	});
}

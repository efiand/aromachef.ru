import { createServer } from 'node:http';
import { log } from '#common/lib/log.js';
import { renderErrorPage } from '#common/templates/error-page.js';
import { host, isDev, port } from '#server/constants.js';
import { getCookies } from '#server/lib/cookies.js';
import { closeDbPool } from '#server/lib/db.js';
import jwt from '#server/lib/jwt.js';
import { renderPage } from '#server/lib/page.js';
import { getPageFromCache, recordPagesCache } from '#server/lib/pages-cache.js';
import { getRequestBody } from '#server/lib/request.js';
import { routes } from '#server/routes/index.js';

/** @type {(server?: import("node:http").Server) => Promise<void>} */
export async function closeApp(server) {
	try {
		if (server) {
			await new Promise((resolve, reject) => {
				server.close((err) => (err ? reject(err) : resolve('')));
			});
		}

		await closeDbPool();
	} catch (error) {
		log.error('❌ [CLOSING ERROR]', error);
	}
}

/** @type {(options?: CreateAppOptions) => import("node:http").Server} */
export function createApp({ isQuiet = false, middleware, port: listenPort = port } = {}) {
	const server = createServer((req, res) => {
		const dispatch = () => next(req, res, { isQuiet });

		if (middleware) {
			middleware(req, res, dispatch);
		} else {
			dispatch();
		}
	});

	server.listen(listenPort, 'localhost', () => {
		if (!isQuiet) {
			log.info(`✅ Сервер запущен по адресу: ${host}`);
		}
	});

	return server;
}

/** @type {(server?: import("node:http").Server) => string} */
export function getAppHost(server) {
	if (!server) {
		throw new Error('Сервер не запущен');
	}

	const address = server.address();

	if (!address || typeof address === 'string') {
		throw new Error('Сервер не слушает порт');
	}

	return `http://localhost:${address.port}`;
}

/** @type {ErrorHandler} */
async function handleError({ error, isAdmin, isAuthorized, isQuiet = false, url: { href, pathname } }) {
	let message = 'На сервере произошла ошибка.';
	let statusCode = 500;
	if (error instanceof Error) {
		if (typeof error.cause === 'number') {
			statusCode = error.cause;
		}
		if (isDev || statusCode !== 500) {
			({ message } = error);
		}
	}

	if (!isQuiet && !pathname?.startsWith('/__')) {
		log.error(`❌ [HTTP ERROR ${statusCode} | ${href}]`, error);
	}

	const heading = `Ошибка ${statusCode}`;
	const template = await renderPage({
		description: 'Страница ошибок.',
		heading,
		isAuthorized,
		pageTemplate: renderErrorPage(isAdmin ? '' : heading, message),
		pathname,
	});

	return { statusCode, template };
}

/** @type {(req: RouteRequest, res: RouteResponse, options?: AppNextOptions) => Promise<void>} */
async function next(req, res, { isQuiet = false } = {}) {
	const { method = 'GET' } = req;
	const url = new URL(`${host}${req.url}`);
	const { pathname } = url;
	const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
	const isApi = pathname.startsWith('/api/');
	const [, rawRouteName = '', rawId, rawIdInApi] = pathname.split('/');
	const id = Number(isApi || isAdmin ? rawIdInApi : rawId);

	let routeName = rawRouteName;
	if (isApi) {
		routeName = `api/${rawId}`;
	} else if (isAdmin) {
		routeName = `admin/${rawId}`;
	}

	const routeKey = Number.isNaN(id) ? pathname : `/${routeName}/:id`;
	const route = routes[routeKey];

	let contentType = 'text/html; charset=utf-8';
	let isAuthorized = false;
	let redirect = '';
	let statusCode = 200;
	let template = '';

	try {
		const { authToken } = getCookies(req);
		isAuthorized = Boolean(authToken && jwt.verify(authToken, process.env.AUTH_SECRET));

		if (!route) {
			throw new Error('Страница не найдена.', { cause: 404 });
		}

		if (!route[method]) {
			if (method === 'HEAD' && route.GET) {
				route.HEAD = route.GET;
			} else {
				throw new Error('Method not allowed!', { cause: 405 });
			}
		}

		if (isAdmin && pathname !== '/admin/auth' && !isAuthorized) {
			res.statusCode = 302;
			res.setHeader('Location', '/admin/auth');
			res.end();
			return;
		}

		const body = await getRequestBody(req);
		const isCanonical = Object.keys(body).length === 0;
		const isFragment = Object.keys(body).length === 1 && body.fragment !== undefined;
		const needCache = !isAuthorized && !isAdmin && (isCanonical || isFragment);

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
			const routeData = await route[method]({ body, id, isAuthorized, req, res });
			({ contentType = 'text/html; charset=utf-8', redirect = '', statusCode = 200, template = '' } = routeData);

			if (routeData.page) {
				template = await renderPage({ ...routeData.page, isAuthorized, pathname });
			}

			if (needCache) {
				recordPagesCache(url.pathname, { contentType, template }, isFragment);
			}
		}
	} catch (error) {
		({ statusCode, template } = await handleError({ error, isAdmin, isAuthorized, isQuiet, url }));
	}

	if (redirect) {
		if (statusCode === 200) {
			statusCode = 302;
		}
		res.setHeader('Location', redirect);
	} else {
		res.setHeader('Content-Type', contentType);
	}
	res.statusCode = statusCode;
	res.end(method === 'HEAD' ? '' : template);
}

/**
 * Ждёт, пока сервер откроет порт и начнёт принимать запросы.
 *
 * @type {(server: import("node:http").Server) => Promise<void>}
 */
export async function waitForApp(server) {
	if (server.listening) {
		return;
	}

	await new Promise((resolve, reject) => {
		server.once('listening', resolve);
		server.once('error', reject);
	});
}

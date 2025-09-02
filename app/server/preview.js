import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { STATIC_MIME_TYPES, staticExtensions } from "#!/common/constants.js";
import { host, isDev } from "#!/server/constants.js";
import { createApp } from "#!/server/lib/app.js";

let sseData = "reload";

/**
 * Server Sent Events
 *
 * @type {(res: RouteResponse) => void}
 */
function sendReload(res) {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	});
	res.write(`retry: 33\ndata: ${sseData}\nid: ${Date.now()}\n\n`);
	sseData = "";
}

createApp(async (req, res, next) => {
	if (isDev && req.url === "/dev/watch") {
		sendReload(res);
		return;
	}

	const { pathname } = new URL(`${host}${req.url}`);
	if (pathname === "/.well-known/appspecific/com.chrome.devtools.json") {
		res.setHeader("Content-Type", "application/json");
		res.end("{}");
		return;
	}

	const ext = path.extname(pathname);
	if (!staticExtensions.has(ext)) {
		next?.(req, res);
		return;
	}

	if (pathname.includes("/pictures")) {
		try {
			const filePath = path.join(process.cwd(), pathname);
			try {
				await access(filePath);
				res.writeHead(200, { "Content-Type": STATIC_MIME_TYPES[ext] });
				createReadStream(filePath).pipe(res);
			} catch {
				const pictureRes = await fetch(`https://aromachef.ru${pathname}`);
				if (pictureRes.ok) {
					const arrayBuffer = await pictureRes.arrayBuffer();
					res.writeHead(200, { "Content-Type": STATIC_MIME_TYPES[ext] });
					res.end(Buffer.from(arrayBuffer));
				}
			}
		} catch (error) {
			console.error(error);
			next?.(req, res);
		}
		return;
	}

	try {
		const staticDir = isDev && /^\/client|common|components\/.*\.(css|js|svg)$/.test(pathname) ? "./app" : "./public";
		const filePath = path.join(process.cwd(), staticDir, pathname);
		await access(filePath);
		res.writeHead(200, { "Content-Type": STATIC_MIME_TYPES[ext] });
		createReadStream(filePath).pipe(res);
	} catch (error) {
		console.error(error);
		next?.(req, res);
	}
});

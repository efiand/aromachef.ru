import { access, mkdir, writeFile } from "node:fs/promises";
import { STATIC_PAGES } from "#common/constants.js";
import { host } from "#server/constants.js";
import { createApp } from "#server/lib/app.js";
import { minifyHtml } from "#server/lib/minify-html.js";

const server = createApp();

await Promise.all(
	STATIC_PAGES.map(async (url) => {
		const markup = await fetch(`${host}${url}`).then((res) => res.text());

		if (url.includes(".")) {
			await writeFile(`./public${url}`, markup);
		} else {
			const dir = `./public${url}`;
			try {
				await access(dir);
			} catch {
				await mkdir(dir, { recursive: true });
			}

			await writeFile(`${dir}/index.html`, await minifyHtml(markup));
		}
		console.info(`Страница ${url} сгенерирована.`);
	}),
);

server.close();

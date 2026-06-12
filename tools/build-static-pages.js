import { access, mkdir, writeFile } from 'node:fs/promises';
import { STATIC_PAGES } from '#common/constants.js';
import { host } from '#server/constants.js';
import { closeApp, createApp, waitForApp } from '#server/lib/app.js';
import { minifyHtml } from '#server/lib/minify-html.js';

const server = createApp({ isQuiet: true });
let completedPages = 0;

try {
	await waitForApp(server);

	for (const url of STATIC_PAGES) {
		const markup = await fetch(`${host}${url}`).then((res) => res.text());
		const publicDir = url.startsWith('/__') ? 'app' : 'public';
		const dir = `./${publicDir}${url}`;

		try {
			await access(dir);
		} catch {
			await mkdir(dir, { recursive: true });
		}

		await writeFile(`${dir}/index.html`, await minifyHtml(markup));

		console.info(`Страница ${url} сгенерирована.`);
		completedPages++;
	}

	console.info(`✅ Всего сгенерировано страниц: ${completedPages}`);
} finally {
	await closeApp(server);
}

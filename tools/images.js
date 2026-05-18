import { readdir, readFile, unlink } from 'node:fs/promises';
import { log } from '#common/lib/log.js';
import { cwd } from '#server/constants.js';
import { processImage } from '#server/lib/image.js';

const src = `${cwd}/tmp/recipe`;
const files = await readdir(src);

for (const filename of files) {
	if (/jpg|png|webp$/.test(filename)) {
		const filePath = `${src}/${filename}`;
		const file = await readFile(filePath);
		try {
			await processImage(file, filename.replace(/\..*$/, ''));
			await unlink(filePath);
			log.info(`✅ ${filename}: процесс завершён успешно!`);
		} catch (error) {
			log.error(error);
		}
	}
}

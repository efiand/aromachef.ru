import { readdir, readFile, unlink } from "node:fs/promises";
import { cwd } from "#server/constants.js";
import { processImage } from "#server/lib/image.js";

const src = `${cwd}/tmp/recipe`;
const files = await readdir(src);

await Promise.all(
	files
		.filter((file) => /jpg|png|webp$/.test(file))
		.map(async (filename) => {
			const filePath = `${src}/${filename}`;
			const file = await readFile(filePath);
			await processImage(file, filename.replace(/\..*$/, ""));
			await unlink(filePath);
		}),
);

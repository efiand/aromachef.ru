import { readdir, readFile, unlink } from "node:fs/promises";
import { cwd } from "#server/constants.js";
import { processImage } from "#server/lib/image.js";

const src = `${cwd}/temp/recipe`;
const files = await readdir(src);

await Promise.all(
	files
		.filter((file) => /jpg|png|webp$/.test(file))
		.map(async (filename) => {
			const file = await readFile(`${cwd}/temp/recipe/${filename}`);
			await processImage(file, filename.replace(/\..*$/, ""));
			await unlink(`${src}/${filename}`);
		}),
);

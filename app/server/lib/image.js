import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { cwd } from "#server/constants.js";
import { upload } from "#server/lib/yandex-disk.js";

sharp.cache(false);
sharp.concurrency(1);

const WEBP_OPTIONS = { chromaSubsampling: "4:2:0", effort: 4, quality: 75 };
const AVIF_OPTIONS = { chromaSubsampling: "4:2:0", effort: 8, quality: 50 };

/** @type {(image: sharp.SharpInput, name: string, dir?: string) => Promise<void>} */
export async function processImage(rawImage, name, dir = "recipe") {
	const image = sharp(rawImage);
	const [id, alias] = name.split("-");

	/** @type {Promise<void>[]} */
	const uploads = [];

	/** @type {(filename: string, image: sharp.Sharp) => Promise<void>} */
	async function process(filename, image) {
		const webpFilename = `pictures/${dir}/${filename}.webp`;
		const avifFilename = `pictures/${dir}/${filename}.avif`;

		const webpBuffer = await image.clone().webp(WEBP_OPTIONS).toBuffer();
		await writeFile(`${cwd}/${webpFilename}`, webpBuffer);
		uploads.push(upload(webpFilename, webpBuffer));

		const avifBuffer = await image.avif(AVIF_OPTIONS).toBuffer();
		await writeFile(`${cwd}/${avifFilename}`, avifBuffer);
		uploads.push(upload(avifFilename, avifBuffer));
	}

	if (alias) {
		await process(`${name}@2x`, image.clone());
		await process(`${name}@1x`, image.clone().resize(384));
	}

	if (alias === "cooking" || !alias) {
		await process(`${id}@2x`, image.clone().resize(544).extract({ height: 408, left: 0, top: 272, width: 544 }));
		await process(`${id}@1x`, image.clone().resize(272).extract({ height: 204, left: 0, top: 136, width: 272 }));
	}

	await Promise.all(uploads);
}

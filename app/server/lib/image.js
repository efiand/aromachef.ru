import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { cwd } from "#server/constants.js";
import { upload } from "#server/lib/yandex-disk.js";

sharp.cache(false);
sharp.concurrency(1);

const WEBP_OPTIONS = { quality: 75, effort: 4, chromaSubsampling: "4:2:0" };
const AVIF_OPTIONS = { quality: 60, effort: 8, chromaSubsampling: "4:2:0" };

/** @type {(image: sharp.SharpInput, name: string) => Promise<void>} */
export async function processImage(rawImage, name) {
	const image = sharp(rawImage);
	const [id, alias] = name.split("-");

	/** @type {Promise<void>[]} */
	const outputPromises = [];

	/** @type {(filename: string, image: sharp.Sharp) => Promise<void>} */
	async function updateOutputPromises(filename, image) {
		const webpFilename = `pictures/recipe/${filename}.webp`;
		const avifFilename = `pictures/recipe/${filename}.avif`;

		const webpBuffer = await image.clone().webp(WEBP_OPTIONS).toBuffer();
		await writeFile(`${cwd}/${webpFilename}`, webpBuffer);
		await upload(webpFilename, webpBuffer);

		const avifBuffer = await image.avif(AVIF_OPTIONS).toBuffer();
		await writeFile(`${cwd}/${avifFilename}`, avifBuffer);
		await upload(avifFilename, avifBuffer);
	}

	const promises = [
		updateOutputPromises(`${name}@2x`, image.clone()),
		updateOutputPromises(`${name}@1x`, image.clone().resize(384)),
	];

	if (alias === "cooking") {
		promises.push(
			updateOutputPromises(
				`${id}@2x`,
				image.clone().resize(544).extract({ height: 408, left: 0, top: 272, width: 544 }),
			),
			updateOutputPromises(
				`${id}@1x`,
				image.clone().resize(272).extract({ height: 204, left: 0, top: 136, width: 272 }),
			),
		);
	}

	await Promise.all(promises);
	await Promise.all(outputPromises);
}

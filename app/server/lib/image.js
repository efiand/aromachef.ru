import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { cwd } from "#!/server/constants.js";
import { upload } from "#!/server/lib/yandex-disk.js";

const webpOptions = { quality: 75 };

/** @type {(image: sharp.SharpInput, name: string) => Promise<void>} */
export async function processImage(rawImage, name) {
	const image = sharp(rawImage);
	const [id, alias] = name.split("-");

	const promises = [
		(async () => {
			const filename = `pictures/recipe/${name}@2x.webp`;
			const buffer = await image.clone().webp(webpOptions).toBuffer();
			await Promise.all([writeFile(`${cwd}/${filename}`, buffer), upload(filename, buffer)]);
		})(),
		(async () => {
			const filename = `pictures/recipe/${name}@1x.webp`;
			const buffer = await image.clone().resize(384).webp(webpOptions).toBuffer();
			await Promise.all([writeFile(`${cwd}/${filename}`, buffer), upload(filename, buffer)]);
		})(),
	];

	if (alias === "cooking") {
		promises.push(
			(async () => {
				const filename = `pictures/recipe/${id}@2x.webp`;
				const buffer = await image
					.clone()
					.resize(544)
					.extract({ height: 408, left: 0, top: 272, width: 544 })
					.webp(webpOptions)
					.toBuffer();
				await Promise.all([writeFile(`${cwd}/${filename}`, buffer), upload(filename, buffer)]);
			})(),
			(async () => {
				const filename = `pictures/recipe/${id}@1x.webp`;
				const buffer = await image
					.clone()
					.resize(272)
					.extract({ height: 204, left: 0, top: 136, width: 272 })
					.webp(webpOptions)
					.toBuffer();
				await Promise.all([writeFile(`${cwd}/${filename}`, buffer), upload(filename, buffer)]);
			})(),
		);
	}

	await Promise.all(promises);
}

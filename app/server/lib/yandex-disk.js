import path from "node:path";
import { STATIC_MIME_TYPES } from "#!/common/constants.js";

const { YADISK_TOKEN } = process.env;

/** @type {(filename: string) => Promise<{ contentType: string; file: ArrayBuffer }>} */
export async function download(filename) {
	const url = await getUrl(filename, "download");
	const response = await fetch(url);
	const file = await response.arrayBuffer();

	return {
		contentType: STATIC_MIME_TYPES[path.extname(filename)] || "application/octet-stream",
		file,
	};
}

/** @type {(filename: string, mode: 'download' | 'upload') => Promise<string>} */
async function getUrl(filename, mode) {
	const append = mode === "upload" ? "&overwrite=true" : "";

	const response = await fetch(
		`https://cloud-api.yandex.net/v1/disk/resources/${mode}?path=app:/aromachef/${filename}&fields=href${append}`,
		{ headers: { Authorization: `OAuth ${YADISK_TOKEN}` } },
	);
	const { href } = await response.json();

	return href.toString();
}

/** @type {(filename: string, payload: string | import('node:buffer').WithImplicitCoercion<ArrayLike<number>>) => Promise<void>} */
export async function upload(filename, payload) {
	const url = await getUrl(filename, "upload");

	await fetch(url, {
		body: Buffer.from(payload),
		method: "PUT",
	});
}

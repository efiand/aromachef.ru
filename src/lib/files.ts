import { YADISK_TOKEN } from '$env/static/private';
import mime from 'mime/lite';
import path from 'node:path';

async function download(filename: string) {
	const url = await getUrl(filename, 'download');
	const file = await fetch(url).then(function (response) {
		return response.arrayBuffer();
	});

	return {
		contentType:
			mime.getType(path.extname(filename)) || 'application/octet-stream',
		file
	};
}

async function getUrl(filename: string, mode: 'download' | 'upload') {
	const append = mode === 'upload' ? '&overwrite=true' : '';

	const response: { href: URL } = await fetch(
		`https://cloud-api.yandex.net/v1/disk/resources/${mode}?path=app:/aromachef/${filename}&fields=href${append}`,
		{ headers: { Authorization: `OAuth ${YADISK_TOKEN}` } }
	).then(function (response) {
		return response.json();
	});

	return response.href.toString();
}

async function upload(filename: string, payload: string) {
	const url = await getUrl(filename, 'upload');

	return await fetch(url, {
		body: Buffer.from(payload),
		method: 'PUT'
	});
}

export { download, upload };

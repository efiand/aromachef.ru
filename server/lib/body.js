import { BASE_URL } from "#!/constants.js";

/** @type {(params: URLSearchParams) => Record<string, string>} */
function getObjectFromSearchParams(params) {
	/** @type {Record<string, string>} */
	const data = {};

	params.forEach((value, key) => {
		data[key] = value;
	});

	return data;
}

/** @type {(req: RouteRequest) => Promise<Record<string, string>>} */
export function getRequestBody(req) {
	return new Promise((resolve, reject) => {
		if (req.method === "GET") {
			const { searchParams } = new URL(`${BASE_URL}${req.url}`);
			resolve(getObjectFromSearchParams(searchParams));
			return;
		}

		/** @type {Uint8Array<ArrayBufferLike>[]} */
		const chuncks = [];
		req
			.on("error", (error) => {
				reject(error);
			})
			.on("data", (chunk) => {
				chuncks.push(chunk);
			})
			.on("end", () => {
				const body = Buffer.concat(chuncks).toString();
				resolve(getObjectFromSearchParams(new URLSearchParams(body)));
			});
	});
}

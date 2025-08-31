import formidable from "formidable";
import { BASE_URL } from "#!/common/constants.js";

/** @type {(params: URLSearchParams) => ReqBody} */
function getObjectFromSearchParams(params) {
	/** @type {ReqBody} */
	const data = {};

	params.forEach((value, key) => {
		data[key] = value;
	});

	return data;
}

/** @type {(req: RouteRequest) => Promise<ReqBody>} */
export async function getRequestBody(req) {
	if (req.method === "GET") {
		const { searchParams } = new URL(`${BASE_URL}${req.url}`);
		return getObjectFromSearchParams(searchParams);
	}

	const form = formidable();
	try {
		const [fields, files] = await form.parse(req);

		/** @type {ReqBody} */
		const data = { files };

		Object.entries(fields).forEach(([name, value]) => {
			data[name] = Array.isArray(value) && value.length === 1 ? value[0] : value;
		});

		return data;
	} catch {
		return {};
	}
}

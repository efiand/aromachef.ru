import formidable from "formidable";
import { BASE_URL } from "#common/constants.js";

const FORMIDABLE_OPTIONS = {
	allowEmptyFiles: true,
	minFileSize: 0,
};

/** @type {(req: RouteRequest) => Promise<ReqBody>} */
export async function getRequestBody(req) {
	/** @type {ReqBody} */
	const data = {};

	if (req.method === "GET") {
		const { searchParams } = new URL(`${BASE_URL}${req.url}`);

		searchParams.forEach((value, key) => {
			data[key] = value;
		});

		return data;
	}

	const form = formidable(FORMIDABLE_OPTIONS);
	const [fields, files] = await form.parse(req);

	Object.entries(files).forEach(([name, values]) => {
		if (!values) {
			return;
		}

		/** @type {string[]} */
		const items = [];
		values.forEach((file) => {
			if (file.size) {
				items.push(file.filepath);
			}
		});

		if (items.length > 0) {
			data[name] = items.length === 1 && !name.includes("[]") ? items[0] : items;
		}
	});

	Object.entries(fields).forEach(([name, value]) => {
		data[name] = Array.isArray(value) && value.length === 1 && !name.includes("[]") ? value[0] : value;
	});

	return data;
}

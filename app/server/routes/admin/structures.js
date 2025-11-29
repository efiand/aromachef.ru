import { renderStructureForms } from "#common/templates/structure-forms.js";
import { getDbError, processDb } from "#server/lib/db.js";
import { processImage } from "#server/lib/image.js";
import { prepareText } from "#server/lib/prepare-text.js";

const CREATE_STRUCTURE_QUERY = /* sql */ `INSERT INTO structures (title) VALUES(?);`;
const STRUCTURES_QUERY = /* sql */ `SELECT id, title FROM structures ORDER BY title;`;
const UPDATE_STRUCTURE_QUERY = /* sql */ `UPDATE structures SET title = ? WHERE id = ?;`;

export const structuresAdminRoute = {
	/** @type {RouteMethod} */
	async GET() {
		return getView();
	},

	/** @type {RouteMethod} */
	async POST({ body }) {
		const { id, image, title } = /** @type {{ id: string; image: string; title: string }} */ (body);
		const payload = prepareText(title);
		const errors = [];
		let newId = parseInt(id, 10);

		if (newId) {
			try {
				await processDb(UPDATE_STRUCTURE_QUERY, [payload, newId]);
			} catch (updatingError) {
				errors.push(/* html */ `<b>Ошибка обновления раздела ${id}:</b> ${getDbError(updatingError)}`);
			}
		} else {
			try {
				/** @type {import('mysql2').ResultSetHeader} */
				(({ insertId: newId } = await processDb(CREATE_STRUCTURE_QUERY, payload)));
			} catch (creatingError) {
				errors.push(/* html */ `<b>Ошибка создания раздела:</b> ${getDbError(creatingError)}`);
			}
		}

		if (image) {
			try {
				await processImage(image, `${newId}`, "structure");
			} catch (imageError) {
				errors.push(/* html */ `<b>Ошибка добавления изображения для раздела ${newId}:</b> ${imageError}`);
			}
		}

		if (errors.length) {
			return getView(errors, title);
		}

		return { redirect: `/admin/structures` };
	},
};

/** @type {(errors?: string[], title?: string) => Promise<RouteData>} */
async function getView(errors = [], title = "") {
	/** @type {DbItem[]} */
	const structures = await processDb(STRUCTURES_QUERY);

	return {
		page: {
			heading: "Разделы",
			pageTemplate: renderStructureForms([{ id: 0, title }, ...structures], errors),
		},
	};
}

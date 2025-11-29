import { renderTagForms } from "#common/templates/tag-forms.js";
import { getDbError, processDb } from "#server/lib/db.js";

const CREATE_TAG_QUERY = /* sql */ `INSERT INTO tags (title) VALUES(?);`;
const TAGS_QUERY = /* sql */ `SELECT id, title FROM tags ORDER BY title;`;
const UPDATE_TAG_QUERY = /* sql */ `UPDATE tags SET title = ? WHERE id = ?;`;

export const tagsAdminRoute = {
	/** @type {RouteMethod} */
	async GET() {
		return getView();
	},

	/** @type {RouteMethod} */
	async POST({ body }) {
		const { id, title } = /** @type {{ id: string; title: string }} */ (body);
		const newId = parseInt(id, 10);
		let error = "";

		if (newId) {
			try {
				await processDb(UPDATE_TAG_QUERY, [title, newId]);
			} catch (updatingError) {
				error = /* html */ `<b>Ошибка обновления тега ${id}:</b> ${getDbError(updatingError)}`;
			}
		} else {
			try {
				await processDb(CREATE_TAG_QUERY, title);
			} catch (creatingError) {
				error = /* html */ `<b>Ошибка создания тега:</b> ${getDbError(creatingError)}`;
			}
		}

		if (error) {
			return getView(error, title);
		}

		return { redirect: `/admin/tags` };
	},
};

/** @type {(error?: string, title?: string) => Promise<RouteData>} */
async function getView(error = "", title = "") {
	/** @type {DbItem[]} */
	const tags = await processDb(TAGS_QUERY);

	return {
		page: {
			heading: "Теги",
			pageTemplate: renderTagForms([{ id: 0, title }, ...tags], error),
		},
	};
}

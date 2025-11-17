import { processDb } from "#server/lib/db.js";

const query = getQuery();
const queryWithPublishedOnly = getQuery(/* sql */ `AND published = 1`);

function getQuery(queryCondition = "") {
	return /* sql */ `
		SELECT id, title, 0 AS tag FROM structures s
			WHERE (
				SELECT count(id) FROM recipes WHERE structureId = s.id ${queryCondition}
			) > 0
		UNION
		SELECT id, title, 1 AS tag FROM tags t
			WHERE (
				SELECT count(id) FROM recipes WHERE id IN (
					SELECT recipeId FROM recipesTags WHERE tagId = t.id
				)
				${queryCondition}
			) > 0
		ORDER BY title;
	`;
}

export async function getStructuresAndTags(publishedOnly = true) {
	/** @type {(DbItem & { tag: 0 | 1 })[]} */
	const structuresAndTags = await processDb(publishedOnly ? queryWithPublishedOnly : query);

	/** @type {(DbItem)[]} */
	const structures = [];

	/** @type {(DbItem)[]} */
	const tags = [];

	structuresAndTags.forEach(({ id, tag, title }) => {
		if (tag) {
			tags.push({ id, title });
		} else {
			structures.push({ id, title });
		}
	});

	return [structures, tags];
}

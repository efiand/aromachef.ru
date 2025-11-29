/** @type {(tag: DbItem) => string} */
function renderTagForm({ id, title }) {
	const label = id ? "Изменить" : "Добавить";

	return /* html */ `
		<li>
			<form class="tag-forms__form" method="post">
				<input name="id" type="hidden" value='${id}'>
				<input
					name="title"
					value="${title}"
					type="text"
					maxlength="50"
					aria-label="${label} тег"
					required
				>
				<button class="button" type="submit" data-component="submitter">${label}</button>
			</form>
		</li>
	`;
}

/** @type {(tags: DbItem[], error?: string) => string} */
export function renderTagForms(tags, error = "") {
	return /* html */ `
		<div class="tag-forms">
			${error ? /* html */ `<p class="_error">${error}</p>` : ""}
			<ul class="tag-forms__list">
				${tags.map(renderTagForm).join("")}
			</ul>
		</div>
	`;
}

import { renderFormErrors } from '#common/templates/form-errors.js';
import { renderImagePicker } from '#common/templates/image-picker.js';

/** @type {(tag: DbItem) => string} */
function renderStructureForm({ id, title }) {
	const label = id ? 'Изменить' : 'Добавить';

	return /* html */ `
		<li>
			<form class="structure-forms__form" method="post" enctype="multipart/form-data">
				<input name="id" type="hidden" value='${id}'>

				${renderImagePicker(id, '', 'Изображение', 'structure')}

				<input
					name="title"
					value="${title}"
					type="text"
					maxlength="500"
					aria-label="${label} раздел"
					required
				>

				<button class="button" type="submit" data-component="submitter">${label}</button>
			</form>
		</li>
	`;
}

/** @type {(tags: DbItem[], errors?: string[]) => string} */
export function renderStructureForms(tags, errors = []) {
	return /* html */ `
		<div class="structure-forms">
			${errors.length ? /* html */ renderFormErrors(errors) : ''}

			<ul class="structure-forms__list">
				${tags.map(renderStructureForm).join('')}
			</ul>
		</div>
	`;
}

/** @type {(item: DbItem, selectedValues?: (number | string)[]) => string} */
function renderOptionFromDbItem({ id, title }, selectedValues) {
	return /* html */ `
		<option
			value="${id}"
			${selectedValues?.includes(id) ? 'selected' : ''}
		>
			${title}
		</option>
	`;
}

/** @type {(params: SelectParams) => string} */
export function renderSelect({
	endpoint,
	isAddingSupport,
	isEmptySupport,
	isRequired,
	label,
	name,
	options,
	selectedValues,
}) {
	return /* html */ `
		<div class="form-group form-group--select">
			${
				label
					? /* html */ `
						<label ${isRequired ? 'class="_required"' : ''} for="${name}">
							${label}
						</label>
					`
					: ''
			}
			<div class="select">
				<select
					${label ? `id="${name}"` : ''}
					name="${name}"
					${endpoint ? `data-component="selectMenu" data-endpoint="${endpoint}"` : ''}
					${isRequired ? 'required' : ''}
				>
					${isEmptySupport ? /* html */ `<option value="" hidden></option>` : ''}
					${isAddingSupport ? /* html */ `<option value="0">ДОБАВИТЬ</option>` : ''}
					${options.map((item) => renderOptionFromDbItem(item, selectedValues)).join('')}
				</select>
			</div>
		</div>
	`;
}

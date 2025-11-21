function renderFormError(error = "") {
	return /* html */ `<li>${error}</li>`;
}

/** @type {(errors: string[]) => string} */
export function renderFormErrors(errors) {
	return /* html */ `<ul class="_error">${errors.map(renderFormError).join("")}</ul>`;
}

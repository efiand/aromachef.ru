/** @type {(param: { checked?: boolean; item: DbItem; name: string }) => string} */
export function renderChecker({ checked = false, item: { id, title }, name }) {
	return /* html */ `
		<label class="checker">
			<input
				name="${name}"
				value="${id}"
				type="checkbox"
				${checked ? "checked" : ""}
			>
			${title}
		</label>
	`;
}

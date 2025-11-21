/** @type {(param: { checkedIds: number[]; item: DbItem; name: string }) => string} */
export function renderChecker({ checkedIds, item: { id, title }, name }) {
	return /* html */ `
		<li>
			<label class="checker">
				<input
					name="${name}"
					value="${id}"
					type="checkbox"
					${checkedIds.includes(id) ? "checked" : ""}
				>
				${title}
			</label>
		</li>
	`;
}

/** @type {(param: { checkedIds: number[]; items: DbItem[]; name: string }) => string} */
export function renderCheckers({ checkedIds, items, name }) {
	return /* html */ `
		<ul class="checkers">
			${items.map((item) => renderChecker({ checkedIds, item, name })).join("")}
		</ul>
	`;
}

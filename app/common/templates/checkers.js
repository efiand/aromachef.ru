import { renderChecker } from '#common/templates/checker.js';

/** @type {(param: { checkedIds: number[]; items: DbItem[]; name: string }) => string} */
export function renderCheckers({ checkedIds, items, name }) {
	return /* html */ `
		<ul class="checkers">
			${items.map((item) => /* html */ `<li>${renderChecker({ checked: checkedIds.includes(item.id), item, name })}</li>`).join('')}
		</ul>
	`;
}

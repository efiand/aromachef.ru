import { resetPageCache } from "#server/lib/pages-cache.js";

export const resetCacheRoute = {
	/** @type {RouteMethod} */
	async GET() {
		resetPageCache();

		return {
			page: {
				heading: "Очистка кэша",
				pageTemplate: /* html */ `
					<div class="operation-status">
						<p>Очистка кэша успешно выполнена.</p>
						<a class="button" href="/admin">OK</a>
					</div>
				`,
			},
		};
	},
};

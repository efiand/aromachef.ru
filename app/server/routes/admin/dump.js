import { dump } from '#server/lib/dump.js';

export const dumpRoute = {
	/** @type {RouteMethod} */
	async GET() {
		await dump();

		return {
			page: {
				heading: 'Резервное копирование',
				pageTemplate: /* html */ `
					<div class="operation-status">
						<p>Резервное копирование успешно выполнено.</p>
						<a class="button" href="/admin">OK</a>
					</div>
				`,
			},
		};
	},
};

export const adminRoute = {
	/** @type {RouteMethod} */
	async GET() {
		return {
			page: {
				heading: "Панель управления",
				pageTemplate: /* html */ `
					<div class="structure">
						<form action="/admin/dump">
							<button class="button" type="submit">Резервное копирование</button>
						</form>

						<div class="structure__aside">
							<ul class="structures structure__menu">
								<li class="structures__item">
									<a class="structures__link" href="/search?q=%3Cp%3E" target="_blank">Все рецепты</a>
								</li>
							</ul>
						</div>
					</div>
				`,
			},
		};
	},
};

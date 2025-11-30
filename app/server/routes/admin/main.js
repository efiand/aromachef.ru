import { processDb } from "#server/lib/db.js";

const RECIPES_QUERY = /* sql */ `
	SELECT id, title, (SELECT count(c.id) FROM comments c WHERE recipeId = r.id) as commentsCount
	FROM recipes r ORDER BY id;
`;

export const adminRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {(DbItem & { commentsCount: number; })[]} */
		const recipes = await processDb(RECIPES_QUERY);

		return {
			page: {
				heading: "Панель управления",
				pageTemplate: /* html */ `
					<div class="structure">
						<div class="page-section">
							<form action="/admin/dump">
								<button class="button" type="submit" data-component="submitter">Резервное копирование</button>
							</form>

							<div class="form-group">
								<label for="recipes">Рецепты</label>
								<select id="recipes" data-component="selectMenu" data-endpoint="/admin/recipe">
									<option value="" hidden></option>
									<option value="0">ДОБАВИТЬ</option>
									${recipes.map((item) => renderOption(item)).join("")}
								</select>
							</div>

							<div class="form-group">
								<label for="recipes">Комментарии</label>
								<select id="recipes" data-component="selectMenu" data-endpoint="/admin/comments">
									<option value="" hidden></option>
									${recipes
										.filter(({ commentsCount }) => commentsCount)
										.map((item) => renderOption(item, "comments"))
										.join("")}
								</select>
							</div>
						</div>

						<div class="structure__aside">
							<ul class="structures structure__menu">
								<li class="structures__item">
									<a class="structures__link" href="/admin/structures">Разделы</a>
								</li>
								<li class="structures__item">
									<a class="structures__link" href="/admin/tags">Теги</a>
								</li>
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

/** @type {(item: DbItem & { commentsCount: number; }, mode?: string) => string} */
function renderOption({ commentsCount, id, title }, mode = "") {
	return /* html */ `
		<option value="${id}">${id} – ${title}${mode === "comments" ? ` (${commentsCount})` : ""}</option>
	`;
}

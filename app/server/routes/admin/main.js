import { renderSelect } from "#common/templates/select.js";
import { processDb } from "#server/lib/db.js";

const ARTICLES_QUERY = /* sql */ `SELECT id, title FROM articles ORDER BY id;`;
const RECIPES_QUERY = /* sql */ `
	SELECT id, title, (SELECT count(c.id) FROM comments c WHERE recipeId = r.id) as commentsCount
	FROM recipes r ORDER BY id;
`;

export const adminRoute = {
	/** @type {RouteMethod} */
	async GET() {
		/** @type {(DbItem & { commentsCount?: number; })[][]} */
		const [recipes, articles] = await Promise.all([processDb(RECIPES_QUERY), processDb(ARTICLES_QUERY)]);

		return {
			page: {
				heading: "Панель управления",
				pageTemplate: /* html */ `
					<div class="structure">
						<div class="page-section">
							${renderSelect({
								endpoint: "/admin/recipe",
								isAddingSupport: true,
								isEmptySupport: true,
								label: "Рецепты",
								name: "recipes",
								options: recipes.map((item) => mapOption(item)),
							})}

							${renderSelect({
								endpoint: "/admin/comments",
								isEmptySupport: true,
								label: "Комментарии",
								name: "comments",
								options: recipes
									.filter(({ commentsCount }) => commentsCount)
									.map((item) => mapOption(item, "comments")),
							})}

							${renderSelect({
								endpoint: "/admin/blog",
								isAddingSupport: true,
								isEmptySupport: true,
								label: "Статьи",
								name: "articles",
								options: articles.map((item) => mapOption(item)),
							})}

							<form action="/admin/dump">
								<button class="button" type="submit" data-component="submitter">Резервное копирование</button>
							</form>

							<form action="/admin/reset-cache">
								<button class="button" type="submit" data-component="submitter">Очистить кэш</button>
							</form>
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

/** @type {(item: DbItem, mode?: string) => DbItem} */
function mapOption({ commentsCount, id, title }, mode = "") {
	return {
		id,
		title: `${id} – ${title}${mode === "comments" ? ` (${commentsCount})` : ""}`,
	};
}

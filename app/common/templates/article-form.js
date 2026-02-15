import { renderCheckers } from "#common/templates/checkers.js";
import { renderFormErrors } from "#common/templates/form-errors.js";
import { renderImagePicker } from "#common/templates/image-picker.js";

/** @type {(data: ArticleInAdmin, errors?: string[]) => string} */
export function renderArticleForm(
	{ articles, content, description, id, published, recipeIds, recipes, relatedIds, title },
	errors = [],
) {
	const cache = { oldRecipeIds: recipeIds, oldRelatedIds: relatedIds };

	return /* html */ `
		<form class="form" id="blog-form" method="post" enctype="multipart/form-data">
			${errors.length ? /* html */ renderFormErrors(errors) : ""}

			<div class="form__article article">
				<div>
					<div class="form__group form-group">
						<label class="_required" for="title">Название</label>
						<input
							id="title"
							name="title"
							value="${title}"
							type="text"
							maxlength="500"
							required
						>
					</div>

					<div class="form__group form-group">
						<label class="_required" for="description">Описание</label>
						<textarea
							id="description"
							name="description"
							rows="5"
							maxlength="1000"
							required
						>${description}</textarea>
					</div>
				</div>

				<div class="article__image">
					${renderImagePicker(id, "content", /* html */ `Изображение`, "blog")}
				</div>
			</div>

			<div class="form__group form-group">
				<label class="_required" for="content">Текст</label>
				<textarea
					id="content"
					name="content"
					rows="25"
					maxlength="30000"
					required
					data-component="editor"
					data-article
				>${content}</textarea>
			</div>

			<div class="form__groups form__groups--equals">
				<div class="form-group">
					<button class="button" type="button" data-checkers-open="recipes">Связанные рецепты</button>
				</div>

				<div class="form-group">
					<button class="button" type="button" data-checkers-open="articles">Связанные статьи</button>
				</div>
			</div>

			<label class="form__checker checker">
				<input name="published" type="checkbox" ${published ? "checked" : ""}>
				Опубликован
			</label>

			<div class="form__footer">
				<button class="form__submit button" type="submit" data-component="submitter">${id ? "Сохранить" : "Добавить"}</button>
				${
					id
						? /* html */ `<a href="/blog/${id}?preview" target="_blank">${published ? "Просмотр" : "Предварительный просмотр"}</a>`
						: ""
				}
			</div>

			<div hidden data-component="checkers" data-checkers="recipes">
				<div>
					<h2 class="form__subtitle">Связанные рецепты:</h2>
					${renderCheckers({ checkedIds: recipeIds, items: recipes, name: "recipeIds[]" })}
				</div>
			</div>
			<div hidden data-component="checkers" data-checkers="articles">
				<div>
					<h2 class="form__subtitle">Связанные статьи:</h2>
					${renderCheckers({ checkedIds: relatedIds, items: articles.filter((article) => article.id !== id), name: "relatedIds[]" })}
				</div>
			</div>

			<input name="id" type="hidden" value='${id}'>
			<input name="cache" type="hidden" value='${JSON.stringify(cache)}'>
		</form>
	`;
}

import { renderCheckers } from "#common/templates/chechers.js";
import { renderFormErrors } from "#common/templates/form-errors.js";
import { renderImagePicker } from "#common/templates/image-picker.js";

/** @type {(data: RecipeInAdmin, errors?: string[]) => string} */
export function renderRecipeForm(
	{
		cooking,
		description,
		id,
		ingredients,
		ingredientsExtra,
		published,
		recipes,
		relatedIds,
		structureId,
		structures,
		tagIds,
		tags,
		telegramId,
		title,
	},
	errors = [],
) {
	const cache = { oldRelatedIds: relatedIds, oldTagIds: tagIds };

	return /* html */ `
		<form class="form" id="recipe-form" method="post" enctype="multipart/form-data">
			${errors.length ? /* html */ renderFormErrors(errors) : ""}

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
					data-editor
				>${description}</textarea>
			</div>

			<div class="form__group form-group">
				<label for="telegramId">Номер видеоинструкции</label>
				<input
					id="telegramId"
					name="telegramId"
					value="${telegramId || ""}"
					type="number"
					min="1"
				>
			</div>

			<div class="form__article article">
				<div>
					<div class="form__group form-group">
						<label class="_required" for="ingredients">Состав</label>
						<textarea
							id="ingredients"
							name="ingredients"
							rows="18"
							maxlength="3000"
							required
							data-editor
						>${ingredients}</textarea>
					</div>

					<div class="form__group form-group">
						<label for="ingredientsExtra">По желанию</label>
						<textarea
							id="ingredientsExtra"
							name="ingredientsExtra"
							rows="3"
							maxlength="1000"
							data-editor
						>${ingredientsExtra || ""}</textarea>
					</div>
				</div>

				<div class="article__image">
					${renderImagePicker(id, "ingredients", /* html */ `Изображение<br>для состава`)}
				</div>
			</div>

			<div class="form__article article article--reverse">
				<div>
					<div class="form__group form-group">
						<label class="_required" for="cooking">Приготовление</label>
						<textarea
							id="cooking"
							name="cooking"
							rows="25"
							maxlength="3000"
							required
							data-editor
						>${cooking}</textarea>
					</div>
				</div>

				<div class="article__image">
					${renderImagePicker(id, "cooking", /* html */ `Изображение<br>для приготовления`)}
				</div>
			</div>

			<div class="form__groups">
				<div class="form-group">
					<button class="button" type="button" data-checkers-open="tags">Теги</button>
					<button class="button" type="button" data-checkers-open="recipes">Связанные рецепты</button>
				</div>

				<div class="form-group">
					<label class="_required" for="structureId">Раздел</label>
					<select
						id="structureId"
						name="structureId"
						required
					>
						<option value="" hidden></option>
						${structures.map((item) => renderOptionFromDbItem(item, [structureId]))}
					</select>
				</div>
			</div>

			<label class="form__checker checker">
				<input name="published" type="checkbox" ${published ? "checked" : ""}>
				Опубликован
			</label>

			<button class="form__submit button" type="submit">${id ? "Сохранить" : "Добавить"}</button>

			<div hidden data-checkers="tags">
				<div>
					<h2 class="form__subtitle">Теги:</h2>
					${renderCheckers({ checkedIds: tagIds, items: tags, name: "tagIds[]" })}
				</div>
			</div>
			<div hidden data-checkers="recipes">
				<div>
					<h2 class="form__subtitle">Связанные рецепты:</h2>
					${renderCheckers({ checkedIds: relatedIds, items: recipes, name: "relatedIds[]" })}
				</div>
			</div>

			<input name="id" type="hidden" value='${id}'>
			<input name="cache" type="hidden" value='${JSON.stringify(cache)}'>
		</form>
	`;
}

/** @type {(item: DbItem, selectedIds: number[]) => string} */
function renderOptionFromDbItem({ id, title }, selectedIds) {
	return /* html */ `
		<option
			value="${id}"
			${selectedIds.includes(id) ? "selected" : ""}
		>
			${title}
		</option>
	`;
}

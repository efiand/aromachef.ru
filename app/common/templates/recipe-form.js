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
		<form class="form" method="post" enctype="multipart/form-data">
			<input name="id" type="hidden" value='${id}'>
			<input name="cache" type="hidden" value='${JSON.stringify(cache)}'>

			${errors.length ? /* html */ `<ul class="form__errors">${errors.map(renderServerError).join("")}</ul>` : ""}

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
						>${ingredients}</textarea>
					</div>

					<div class="form__group form-group">
						<label for="ingredientsExtra">По желанию</label>
						<textarea
							id="ingredientsExtra"
							name="ingredientsExtra"
							rows="3"
							maxlength="1000"
						>${ingredientsExtra || ""}</textarea>
					</div>
				</div>

				${renderImage(id, "ingredients", /* html */ `Изображение<br>для состава`)}
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
						>${cooking}</textarea>
					</div>
				</div>

				${renderImage(id, "cooking", /* html */ `Изображение<br>для приготовления`)}
			</div>

			<div class="form__group form-groups">
				<div class="form__group form-group">
					<label for="tagIds">Теги (несколько – c нажатой клавишей Ctrl)</label>
					<select
						id="tagIds"
						name="tagIds[]"
						size="${tags.length}"
						multiple
					>
						${tags.map((item) => renderOptionFromDbItem(item, tagIds))}
					</select>
				</div>

				<div class="form__group form-group">
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

			<div class="form__group form-group">
				<label for="relatedIds">Связанные рецепты (несколько – c нажатой клавишей Ctrl)</label>
				<select
					id="relatedIds"
					name="relatedIds[]"
					size="10"
					multiple
				>
					${recipes.map((item) => renderOptionFromDbItem(item, relatedIds)).join("")}
				</select>
			</div>

			<label class="form__checker checker" for="published">
				<input id="published" name="published" type="checkbox" ${published ? "checked" : ""}>
				Опубликован
			</label>

			<button class="form__submit button" type="submit">${id ? "Сохранить" : "Добавить"}</button>
		</form>
	`;
}

function renderServerError(error = "") {
	return /* html */ `<li>${error}</li>`;
}

function renderImage(id = 0, alias = "", label = "") {
	return /* html */ `
		<div class="article__image">
			<label
				class="form__image"
				style="background-image: ${id ? `url('/pictures/recipe/${id}-${alias}@2x.webp')` : "none"}"
				data-file-picker
			>
				<span class="form__image-label">${label}</span>
				<input
					class="_visually-hidden"
					name="${alias}Image"
					type="file"
					accept="image/*"
					${id ? "" : "required"}
				>
			</label>
		</div>
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

import { renderCheckers } from '#common/templates/checkers.js';
import { renderFormErrors } from '#common/templates/form-errors.js';
import { renderImagePicker } from '#common/templates/image-picker.js';
import { renderSelect } from '#common/templates/select.js';
import { renderTextarea } from '#common/templates/textarea.js';

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
			${errors.length ? /* html */ renderFormErrors(errors) : ''}

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

			${renderTextarea({
				className: 'form__group',
				isRequired: true,
				label: 'Описание',
				maxlength: 1000,
				name: 'description',
				value: description,
			})}

			<div class="form__group form-group">
				<label for="telegramId">Номер видеоинструкции</label>
				<input
					id="telegramId"
					name="telegramId"
					value="${telegramId || ''}"
					type="number"
					min="1"
				>
			</div>

			<div class="form__article article">
				<div>
					${renderTextarea({
						className: 'form__group',
						isRequired: true,
						label: 'Состав',
						name: 'ingredients',
						rows: 18,
						value: ingredients,
					})}

					${renderTextarea({
						className: 'form__group',
						label: 'По желанию',
						maxlength: 1000,
						name: 'ingredientsExtra',
						rows: 3,
						value: ingredientsExtra,
					})}
				</div>

				<div class="article__image">
					${renderImagePicker(id, 'ingredients', /* html */ `Изображение<br>для состава`)}
				</div>
			</div>

			<div class="form__article article article--reverse">
				<div>
					${renderTextarea({
						className: 'form__group',
						isRequired: true,
						label: 'Приготовление',
						name: 'cooking',
						rows: 25,
						value: cooking,
					})}
				</div>

				<div class="article__image">
					${renderImagePicker(id, 'cooking', /* html */ `Изображение<br>для приготовления`)}
				</div>
			</div>

			<div class="form__groups">
				<div class="form-group">
					<button class="button" type="button" data-checkers-open="tags">Теги</button>
					<button class="button" type="button" data-checkers-open="recipes">Связанные рецепты</button>
				</div>

				${renderSelect({
					isEmptySupport: true,
					isRequired: true,
					label: 'Раздел',
					name: 'structureId',
					options: structures,
					selectedValues: [structureId],
				})}
			</div>

			<label class="form__checker checker">
				<input name="published" type="checkbox" ${published ? 'checked' : ''}>
				Опубликован
			</label>

			<div class="form__footer">
				<button class="form__submit button" type="submit" data-component="submitter">${id ? 'Сохранить' : 'Добавить'}</button>
				${
					id
						? /* html */ `<a href="/recipe/${id}?preview" target="_blank">${published ? 'Просмотр' : 'Предварительный просмотр'}</a>`
						: ''
				}
			</div>

			<div hidden data-component="checkers" data-checkers="tags">
				<div>
					<h2 class="form__subtitle">Теги:</h2>
					${renderCheckers({ checkedIds: tagIds, items: tags, name: 'tagIds[]' })}
				</div>
			</div>
			<div hidden data-component="checkers" data-checkers="recipes">
				<div>
					<h2 class="form__subtitle">Связанные рецепты:</h2>
					${renderCheckers({ checkedIds: relatedIds, items: recipes.filter((recipe) => recipe.id !== id), name: 'relatedIds[]' })}
				</div>
			</div>

			<input name="id" type="hidden" value="${id}">
			<input name="cache" type="hidden" value='${JSON.stringify(cache)}'>
		</form>
	`;
}

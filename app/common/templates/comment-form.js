/** @type {(data: RecipeCommentInForm, error?: string) => string} */
export function renderCommentForm({ answer, name, published, recipeId, recipeTitle, text }, error = "") {
	return /* html */ `
		<form class="form" method="post">
			<p>Рецепт: <a href="/recipe/${recipeId}" target="_blank">${recipeTitle}</a></p>
			<p><a href="/admin/comments/${recipeId}">Список комментариев</a></p>

			${error ? /* html */ `<p class="_error">${error}</p>` : ""}

			<div class="form__group form-group">
				<label for="name">Имя</label>
				<input
					id="name"
					name="name"
					value="${name}"
					type="text"
					maxlength="100"
				>
			</div>

			<div class="form__group form-group">
				<label class="_required" for="description">Текст</label>
				<textarea
					id="text"
					name="text"
					rows="5"
					maxlength="3000"
					required
					data-component="editor"
				>${text}</textarea>
			</div>

			<div class="form__group form__group--indented form-group">
				<label for="answer">Ответ</label>
				<textarea
					id="answer"
					name="answer"
					rows="5"
					maxlength="3000"
					data-component="editor"
				>${answer || ""}</textarea>
			</div>

			<label class="form__checker checker">
				<input name="published" type="checkbox" ${published ? "checked" : ""}>
				Опубликован
			</label>

			<div class="form__footer">
				<button class="form__submit button" name="action" type="submit" value="save" data-component="submitter">
					Изменить
				</button>
				<button class="form__submit button button--destructive" name="action" type="submit" value="delete" data-component="submitter">
					Удалить
				</button>
			</div>

			<input name="recipeId" type="hidden" value="${recipeId}">
			<input name="recipeTitle" type="hidden" value="${recipeTitle}">
		</form>
	`;
}

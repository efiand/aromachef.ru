export function renderSearchInput(value = "") {
	return /* html */ `
		<div class="search-input" data-search-input>
			<input
				class="search-input__input"
				type="search"
				name="q"
				value="${value}"
				autocomplete="off"
				autofocus
				placeholder="Введите запрос"
				aria-label="Введите запрос"
			>
			<button
				class="search-input__button"
				type="button"
				aria-label="Очистить"
			></button>
		</div>
	`;
}

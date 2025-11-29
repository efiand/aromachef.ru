export function renderSearchInput(value = "", async = false) {
	let label = "Введите запрос";
	if (async) {
		label += " (не менее 3-х букв)";
	}

	return /* html */ `
		<div class="search-input" data-component="searchInput">
			<input
				class="search-input__input"
				type="search"
				name="q"
				value="${value}"
				autocomplete="off"
				autofocus
				placeholder="${label}"
				aria-label="${label}"
			>
			<button
				class="search-input__button"
				type="button"
				aria-label="Очистить"
			></button>
		</div>
	`;
}

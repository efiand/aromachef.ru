export function renderImagePicker(id = 0, alias = "", label = "", entity = "recipe") {
	return /* html */ `
		<label
			class="image-picker"
			style="background-image: ${id ? `url('/pictures/${entity}/${id}-${alias}@2x.webp')` : "none"}"
			data-component="filePicker"
		>
			<span class="image-picker__label">${label}</span>
			<input
				class="_visually-hidden"
				name="${alias}Image"
				type="file"
				accept="image/*"
				${id ? "" : "required"}
			>
		</label>
	`;
}

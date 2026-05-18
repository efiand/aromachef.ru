export function renderImagePicker(id = 0, alias = '', label = '', entity = 'recipe') {
	return /* html */ `
		<label
			class="image-picker image-picker--${entity}"
			style="background-image: ${id ? `url('/pictures/${entity}/${id}${alias ? `-${alias}` : ''}@1x.webp')` : 'none'}"
			data-component="filePicker"
		>
			<span class="image-picker__label">${label}</span>
			<input
				class="_visually-hidden"
				name="${alias ? `${alias}Image` : 'image'}"
				type="file"
				accept="image/*"
				${id ? '' : 'required'}
			>
		</label>
	`;
}

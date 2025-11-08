/** @type {(data: ImageParams) => string} */
export function renderImage({ alt = "", imageAlias, isAmp, height, width }) {
	const imageTemplate = /* html */ `
		<img
			class="image"
			src="${imageAlias}@1x.webp"
			srcset="${imageAlias}@2x.webp 2x"
			width="${width}"
			height="${height}"
			alt="${alt}"
			loading="lazy"
		>
	`;

	if (isAmp) {
		return imageTemplate;
	}

	return /* html */ `
		<picture>
			<source type="image/avif" srcset="${imageAlias}@1x.avif 1x, ${imageAlias}@2x.avif 2x">
			${imageTemplate}
		</picture>
	`;
}

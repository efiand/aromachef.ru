import { renderImage } from "#common/templates/image.js";

/** @type {(article: ArticleData) => string} */
export function renderArticle({
	alt = "",
	content = "",
	imageAlias,
	isAmp,
	isSchemaSupport = false,
	itemprop = "",
	reverse = false,
	title = "",
}) {
	const modifier = reverse ? "article--reverse" : "";

	return /* html */ `
		<div class="article ${modifier}" ${itemprop ? `itemprop="${itemprop}"` : ""}>
			<div class="content">
				${title ? /* html */ `<h2>${title}</h2>` : ""}
				${content}
			</div>

			<div class="article__image">
				${renderImage({
					alt: alt.replace("[title]", `«${title}»`),
					height: 672,
					imageAlias,
					isAmp,
					isSchemaSupport,
					width: 384,
				})}
			</div>
		</div>
	`;
}

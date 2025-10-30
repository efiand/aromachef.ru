import { renderImage } from "#common/components/image.js";
import { html } from "#common/utils/mark-template.js";

/** @type {(article: ArticleData) => string} */
export function renderArticle({ alt = "", content = "", imageAlias, isAmp, reverse = false, title = "" }) {
	const modifier = reverse ? "article--reverse" : "";

	return html`
		<div class="article ${modifier}">
			<div class="content">
				${title ? html`<h2>${title}</h2>` : ""}
				${content}
			</div>

			<div class="article__image">
				${renderImage({
					alt: alt.replace("[title]", `«${title}»`),
					height: 672,
					imageAlias,
					isAmp,
					width: 384,
				})}
			</div>
		</div>
	`;
}

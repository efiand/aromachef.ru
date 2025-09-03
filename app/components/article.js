import { html } from "#common/utils/mark-template.js";

/** @type {(article: ArticleData) => string} */
export function renderArticle({ alt = "", content = "", imageAlias, reverse = false, title = "" }) {
	const modifier = reverse ? "article--reverse" : "";

	return html`
		<div class="article ${modifier}">
			<div class="content">
				${title ? html`<h2>${title}</h2>` : ""}
				${content}
			</div>

			<div class="article__image">
				<img
					class="image"
					src="${imageAlias}@1x.webp"
					srcset="${imageAlias}@2x.webp 2x"
					width="384"
					height="672"
					alt="${alt.replace("[title]", `«${title}»`)}"
					loading="lazy"
				>
			</div>
		</div>
	`;
}

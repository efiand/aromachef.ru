import { renderArticle } from "#common/templates/article.js";
import { renderAuthorMeta } from "#common/templates/authorMeta.js";
import { renderImage } from "#common/templates/image.js";

/** @type {(article: ArticleData, i: number) => string} */
function mapArticle(article, i) {
	return renderArticle({
		...article,
		reverse: i % 2 === 1,
	});
}

/**
 * Генерирует HTML-шаблон секции страницы
 * @type {(data: PageSectionData) => string}
 */
export function renderPageSection({
	alt = "",
	articles = [],
	className = "",
	content = "",
	footerTemplate = "",
	imageAlias,
	isAmp,
	itemtype = "",
	next,
	prev,
	publishedAt,
	title,
}) {
	const schemaAttrs = itemtype ? `itemscope itemtype="https://schema.org/${itemtype}"` : "";

	return /* html */ `
		<section class="page-section ${className}" ${schemaAttrs}>
			<header class="page-section__header ${prev ? "page-section__header--with-nav" : ""}">
				${prev ? /* html */ `<a class="page-section__nav-link" href="${prev}" rel="prev" aria-label="Предыдущий рецепт"></a>` : ""}
				<h1 class="page-section__title" ${prev ? ' itemprop="name"' : ""}>${title}</h1>
				${next ? /* html */ `<a class="page-section__nav-link" href="${next}" rel="next" aria-label="Следующий рецепт"></a>` : ""}

				${itemtype ? renderAuthorMeta(publishedAt) : ""}
			</header>

			${
				content
					? /* html */ `<div class="content">${
							imageAlias
								? renderImage({
										alt: alt.replace("[title]", `«${title}»`),
										className: "page-section__image",
										height: 672,
										imageAlias,
										isAmp,
										width: 384,
									})
								: ""
						}${content}</div>`
					: ""
			}

			${articles.map(mapArticle).join("")}

			${footerTemplate}
		</section>
	`;
}

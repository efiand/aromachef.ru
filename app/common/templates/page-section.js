import { renderArticle } from "#common/templates/article.js";
import { renderImage } from "./image.js";

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
	next,
	prev,
	title,
}) {
	return /* html */ `
		<section class="page-section ${className}">
			<header class="page-section__header ${prev ? "page-section__header--with-nav" : ""}">
				${prev ? /* html */ `<a class="page-section__nav-link" href="${prev}" rel="prev" aria-label="Предыдущий рецепт"></a>` : ""}
				<h1 class="page-section__title">${title}</h1>
				${next ? /* html */ `<a class="page-section__nav-link" href="${next}" rel="next" aria-label="Следующий рецепт"></a>` : ""}
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

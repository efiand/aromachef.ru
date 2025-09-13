import { renderArticle } from "#common/components/article.js";
import { html } from "#common/utils/mark-template.js";

/** @type {(article: ArticleData, i: number) => string} */
function mapArticle(article, i) {
	return renderArticle({
		...article,
		reverse: i % 2 === 1,
	});
}

/**
 * Генерирует HTML-шаблон секции страницы
 *
 * @type {(data: PageSectionData) => string}
 */
export function renderPageSection({
	articles = [],
	className = "",
	content = "",
	footerTemplate = "",
	next,
	prev,
	title,
}) {
	return html`
		<section class="page-section ${className}">
			<header class="page-section__header ${prev ? "page-section__header--with-nav" : ""}">
				${prev ? html`<a class="page-section__nav-link" href="${prev}" rel="prev" aria-label="Предыдущий рецепт"></a>` : ""}
				<h1 class="page-section__title">${title}</h1>
				${next ? html`<a class="page-section__nav-link" href="${next}" rel="next" aria-label="Следующий рецепт"></a>` : ""}
			</header>

			${content ? html`<div class="content">${content}</div>` : ""}

			${articles.map(mapArticle).join("")}

			${footerTemplate}
		</section>
	`;
}

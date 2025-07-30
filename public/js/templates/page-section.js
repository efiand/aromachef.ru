import { renderArticle } from "#!/templates/article.js";
import { html } from "#!/utils/mark-template.js";

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
export function renderPageSection({ articles = [], content = "", footerTemplate = "", title }) {
	return html`
		<section class="page-section">
			<h1 class="page-section__title">${title}</h1>

			${content ? html`<div class="content">${content}</div>` : ""}

			${articles.map(mapArticle).join("")}

			${footerTemplate}
		</section>
	`;
}

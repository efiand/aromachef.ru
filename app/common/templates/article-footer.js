import { renderCards } from "#common/templates/cards.js";

/** @type {(params: ArticleFooter) => string} */
export function renderArticleFooter({ isAmp, recipes = [], relatedArticles = [] }) {
	return /* html */ `
		<footer class="article-footer">
			${
				relatedArticles.length
					? /* html */ `
							<p class="article-footer__text">Если понравилась эта статья, изучите также:</p>
							${renderCards({
								alt: "Изображение к статье [title].",
								cards: relatedArticles,
								className: "article-footer__cards",
								isAmp,
							})}
						`
					: ""
			}
			${
				recipes.length
					? /* html */ `
							<p class="article-footer__text">Рецепты с эфирными маслами из статьи:</p>
							${renderCards({
								alt: "На фото изображено блюдо, приготовленное по связанному рецепту [title], в миниатюре.",
								cards: recipes,
								className: "article-footer__cards",
								isAmp,
							})}
						`
					: ""
			}
		</footer>
	`;
}

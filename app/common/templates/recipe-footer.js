import { renderCards } from "#common/templates/cards.js";
import { renderTags } from "#common/templates/tags.js";

/** @type {(params: RecipeFooter) => string} */
export function renderRecipeFooter({ isAmp, relatedRecipes = [], structure, tags }) {
	return /* html */ `
		<footer class="recipe-footer">
			${renderTags({ tags })}
			<a class="recipe-footer__structure-link" href="/structure/${structure.id}" rel="toc">
				${structure.title}
			</a>
			${
				relatedRecipes.length
					? /* html */ `
							<p class="recipe-footer__text">Если понравился этот рецепт, попробуйте также:</p>
							${renderCards({
								alt: "На фото изображено блюдо, приготовленное по связанному рецепту [title], в миниатюре.",
								cards: relatedRecipes,
								className: "recipe-footer__cards",
								isAmp,
							})}
						`
					: ""
			}
			${isAmp ? "" : /* html */ `<div class="recipe-footer__comments" data-component="comments"></div>`}
		</footer>
	`;
}

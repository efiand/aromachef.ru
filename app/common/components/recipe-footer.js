import { renderCards } from "#common/components/cards.js";
import { renderTags } from "#common/components/tags.js";
import { html } from "#common/utils/mark-template.js";

/** @type {(params: RecipeFooter) => string} */
export function renderRecipeFooter({ isAmp, relatedRecipes = [], structure, tags }) {
	return html`
		<div class="recipe-footer">
			${renderTags({ tags })}
			<a class="recipe-footer__structure-link" href="/structure/${structure.id}" rel="toc">
				${structure.title}
			</a>
			${
				relatedRecipes.length
					? html`
							<p class="recipe-footer__text">Если понравился этот рецепт, попробуйте также:</p>
							${renderCards({
								alt: "На фото изображено блюдо, приготовленное по связанному рецепту [title], в миниатюре.",
								className: "recipe-footer__cards",
								cards: relatedRecipes,
								isAmp,
							})}
						`
					: ""
			}
			${isAmp ? "" : html`<div class="recipe-footer__comments comments"></div>`}
		</div>
	`;
}

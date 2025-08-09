import { renderCards } from "#!/templates/cards.js";
import { renderTags } from "#!/templates/tags.js";
import { html } from "#!/utils/mark-template.js";

/** @type {(params:RecipeFooter) => string} */
export function renderRecipeFooter({ relatedRecipes = [], structure, tags }) {
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
							})}
						`
					: ""
			}
		</div>
	`;
}

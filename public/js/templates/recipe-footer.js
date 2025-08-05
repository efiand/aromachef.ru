import { renderCards } from "#!/templates/cards.js";
import { renderTags } from "#!/templates/tags.js";
import { html } from "#!/utils/mark-template.js";

/** @type {(params:{ picturesHost?: string, relatedRecipes?: DbItem[], structure: DbItem, tags: DbItem[] }) => string} */
export function renderRecipeFooter({ structure, relatedRecipes = [], picturesHost = "", tags }) {
	return html`
		<div class="recipe-footer">
			${renderTags({ tags })}
			<a class="recipe-footer__structure-link" href="/structure/${structure.id}">
				${structure.title}
			</a>
			${
				relatedRecipes.length
					? html`
							<p class="recipe-footer__text">Если понравился этот рецепт, попробуйте также:</p>
							${renderCards({
								alt: "На фото изображено блюдо, приготовленное по связанному рецепту [title], в миниатюре.",
								centered: false,
								className: "recipe-footer__cards",
								cards: relatedRecipes,
								picturesHost,
							})}
						`
					: ""
			}
		</div>
	`;
}

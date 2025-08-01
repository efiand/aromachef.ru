import { renderTags } from "#!/templates/tags.js";
import { html } from "#!/utils/mark-template.js";

/** @type {(params:{ structure: DbItem, tags: DbItem[] }) => string} */
export function renderRecipeFooter({ structure, tags }) {
	return html`
		<div class="recipe-footer">
			${renderTags({ tags })}
			<a class="recipe-footer__structure-link" href="/structure/${structure.id}">
				${structure.title}
			</a>
		</div>
	`;
}

import { PROJECT_TITLE } from "#common/constants.js";
import { html } from "#common/utils/mark-template.js";

export const HERO_TEMPLATE = html`
	<div class="hero">
		<p class="hero__heading">
			<svg width="1.6em" height="1.6em" role="img">
				<use href="/images/aromachef-logo.svg#logo"></use>
			</svg>
			${PROJECT_TITLE}
		</p>
		<p class="hero__text"><span>Готовим с эфирными маслами!</span></p>
</div>
`;

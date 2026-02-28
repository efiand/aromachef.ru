import { readFile } from 'node:fs/promises';
import { cwd, isDev } from '#server/constants.js';

const APM_ASSETS_TEMPLATE = /* html */ `
	<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
`;

let cssCache = '';

/** @type {(hasForms?: boolean) => Promise<string>} */
export async function renderAmpAssets(hasForms = false) {
	if (!cssCache) {
		if (isDev) {
			cssCache = await (await import('../../../src/server/css.js')).getCss('critical.css');
		} else {
			cssCache = await readFile(`${cwd}/public/bundles/critical.css`, 'utf-8');
		}
	}

	const formScriptTemplate = hasForms
		? /* html */ `<script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>`
		: '';

	return /* html */ `
		<style amp-custom>${cssCache}</style>
		${APM_ASSETS_TEMPLATE}
		${formScriptTemplate}
	`;
}

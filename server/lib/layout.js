import { ALL_STYLESHEETS, BASE_URL, PROJECT_TITLE } from "#!/constants.js";
import { APM_ASSETS_TEMPLATE } from "#!/templates/amp-assets.js";
import { renderDocumentTitle } from "#!/templates/document-title.js";
import { HERO_TEMPLATE } from "#!/templates/hero.js";
import { YANDEX_METRIKA_TEMPLATE } from "#!/templates/yandex-metrika.js";
import { html } from "#!/utils/mark-template.js";
import { isDev } from "#server/constants.js";
import { getCss } from "#server/lib/css.js";

/** @type {(ampPrefix: string) => string} */
const renderAboutTemplate = (ampPrefix) => html`
	<li class="layout__footer-item">
		<a href="${ampPrefix}/about">Обо мне</a>
	</li>
`;

/** @type {(ampPrefix: string) => string} */
const renderImportantTemplate = (ampPrefix) => html`
	<li class="layout__header-item">
		<a href="${ampPrefix}/important"><strong>Важно!</strong></a>
	</li>
`;

/** @type {(ampPrefix: string) => string} */
const renderSearchTemplate = (ampPrefix) => html`
	<li class="layout__header-item layout__header-item--separated _hidden">
		<a href="${ampPrefix}/search">Поиск</a>
	</li>
`;

/** @type {(isAmp?: boolean) => Promise<string>} */
async function renderAssets(isAmp) {
	if (isAmp) {
		const css = await getCss(ALL_STYLESHEETS);

		return html`
			<style amp-custom>${css}</style>
			${APM_ASSETS_TEMPLATE}
		`;
	}

	const linkTemplates = ALL_STYLESHEETS.map(
		({ media, name }) => html`<link rel="stylesheet" href="/css/${name}.css" ${media ? `media="${media}"` : ""}>`,
	);
	return html`
		${linkTemplates.join("")}
		<script type="importmap">
			{ "imports": { "#!/": "/js/" } }
		</script>
	`;
}

/** @type {(pathname: string, isAmp: boolean) => string} */
function renderUrlMeta(pathname, isAmp) {
	if (!pathname) {
		return html`<meta name="robots" content="noindex, nofollow">`;
	}

	let ampTemplate = "";
	if (!isAmp) {
		const ampUrl = pathname === "/" ? "/amp" : `/amp${pathname}`;
		ampTemplate = html`<link rel="ampurl" href="${BASE_URL}${ampUrl}">`;
	}

	return html`
		${ampTemplate}
		<link rel="canonical" href="${BASE_URL}${pathname}">
		<meta property="og:url" content="${pathname}">
	`;
}

/** @type {(data: LayoutData) => Promise<string>} */
export async function renderLayout({
	isAmp = false,
	description,
	headTemplate = "",
	heading = "",
	ogImage = "/images/og.webp",
	pageTemplate = "",
	pathname = "",
}) {
	const ampPrefix = isAmp ? "/amp" : "";
	const title = renderDocumentTitle(heading);
	const assetsTemplate = await renderAssets(isAmp);

	const template = html`
		<!DOCTYPE html>
		<html lang="ru" prefix="og: http://ogp.me/ns#" ${isAmp ? "⚡" : ""}>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="apple-mobile-web-app-title" content="${PROJECT_TITLE}">

			<title>${title}</title>
			<meta name="description" content="${description}">
			${renderUrlMeta(pathname, isAmp)}
			<meta property="og:title" content="${title}">
			<meta property="og:description" content="${description}">
			<meta property="og:locale" content="ru_RU">
			<meta property="og:type" content="website">
			<meta property="og:site_name" content="${PROJECT_TITLE}">
			<meta property="og:image" content="${ogImage}">
			<meta property="og:image:width" content="544">
			<meta property="og:image:height" content="408">

			${assetsTemplate}

			<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
			<link rel="icon" type="image/svg+xml" href="/favicon.svg">
			<link rel="shortcut icon" href="/favicon.ico">
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
			<link rel="manifest" href="/site.webmanifest">

			<link rel="preload" href="/fonts/noto-sans-400.woff2" as="font" crossorigin>
			<link rel="preload" href="/fonts/noto-sans-600.woff2" as="font" crossorigin>
			<link rel="preload" href="/fonts/noto-serif-400.woff2" as="font" crossorigin>
			<link rel="preload" href="/fonts/noto-serif-700.woff2" as="font" crossorigin>

			${headTemplate}
		</head>

		<body class="layout ${pathname === "/" ? "" : "layout--inner"}">
			${isAmp || isDev ? "" : YANDEX_METRIKA_TEMPLATE}

			<header class="layout__header _container">
				<a class="layout__logo-link" href="${isAmp ? "/amp" : "/"}" aria-label="На главную">
					<svg class="layout__logo" width="1.5rem" height="1.5rem" role="img">
						<use href="/images/aromachef-logo.svg#logo"/>
					</svg>
				</a>
				<ul class="layout__header-list">
					<li class="layout__header-item">
						<a href="/structure">
							Разделы
							<span class="_xs-hidden">и #теги</span>
						</a>
					</li>
					${pathname === "/important" ? "" : renderImportantTemplate(ampPrefix)}
					${pathname === "/search" ? "" : renderSearchTemplate(ampPrefix)}
				</ul>
			</header>

			${pathname === "/" ? HERO_TEMPLATE : ""}

			<main class="layout__main _container">${pageTemplate}</main>

			<footer class="layout__footer _container">
				<ul class="layout__footer-list">
					<li class="layout__footer-item">
						<a class="layout__tg" href="https://t.me/aroma_chef" target="_blank">@aroma_chef</a>
					</li>
					${pathname === "/about" ? "" : renderAboutTemplate(ampPrefix)}
					<li class="layout__footer-item layout__footer-item--last">
						<a href="https://efiand.ru" target="_blank" rel="nofollow">Разработано efiand</a>
					</li>
				</ul>
			</footer>
		</body>
		</html>
	`;

	return isAmp ? template.replace(/="\/(structure|recipe|tag)/g, '="/amp/$1') : template;
}

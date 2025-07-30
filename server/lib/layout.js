import { BASE_URL, PROJECT_TITLE } from "#!/constants.js";
import { renderDocumentTitle } from "#!/templates/document-title.js";
import { HERO_TEMPLATE } from "#!/templates/hero.js";
import { YANDEX_METRIKA_TEMPLATE } from "#!/templates/yandex-metrika.js";
import { html } from "#!/utils/mark-template.js";
import { isDev } from "#server/constants.js";

const ABOUT_TEMPLATE = html`
	<li class="layout__footer-item">
		<a href="/about">Обо мне</a>
	</li>
`;

const IMPORTANT_TEMPLATE = html`
	<li class="layout__header-item">
		<a href="/important"><strong>Важно!</strong></a>
	</li>
`;

const SEARCH_TEMPLATE = html`
	<li class="layout__header-item layout__header-item--separated">
		<a href="/search">Поиск</a>
	</li>
`;

/** @type {(data: LayoutData) => string} */
export function renderLayout({
	description,
	headTemplate = "",
	heading = "",
	ogImage = "/images/og.webp",
	pageTemplate = "",
	pathname = "",
}) {
	const title = renderDocumentTitle(heading);

	const urlTemplate = pathname
		? html`
			<link rel="canonical" href="${BASE_URL}${pathname}">
			<meta property="og:url" content="${pathname}">
		`
		: html`<meta name="robots" content="noindex, nofollow">`;

	return html`
		<!DOCTYPE html>
		<html lang="ru" prefix="og: http://ogp.me/ns#">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="apple-mobile-web-app-title" content="${PROJECT_TITLE}">

			<title>${title}</title>
			<meta name="description" content="${description}">
			${urlTemplate}
			<meta property="og:title" content="${title}">
			<meta property="og:description" content="${description}">
			<meta property="og:locale" content="ru_RU">
			<meta property="og:type" content="website">
			<meta property="og:site_name" content="${PROJECT_TITLE}">
			<meta property="og:image" content="${ogImage}">
			<meta property="og:image:width" content="544">
			<meta property="og:image:height" content="408">

			<link rel="stylesheet" href="/css/common.css">
			<link rel="stylesheet" href="/css/hover.css" media="(hover: hover)">
			<link rel="stylesheet" href="/css/motion.css" media="(prefers-reduced-motion: no-preference)">
			<link rel="stylesheet" href="/css/385-.css" media="(max-width: 385px)">
			<link rel="stylesheet" href="/css/887-.css" media="(max-width: 887px)">
			<link rel="stylesheet" href="/css/888+.css" media="(min-width: 888px)">
			<link rel="stylesheet" href="/css/1280+.css" media="(min-width: 1280px)">

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

			<script type="importmap">
				{ "imports": { "#!/": "/js/" } }
			</script>
		</head>

		<body class="layout ${pathname === "/" ? "" : "layout--inner"}">
			${isDev ? "" : YANDEX_METRIKA_TEMPLATE}

			<header class="layout__header _container">
				<a class="layout__logo-link" href="/" aria-label="На главную">
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
					${pathname === "/important" ? "" : IMPORTANT_TEMPLATE}
					${pathname === "/search" ? "" : SEARCH_TEMPLATE}
				</ul>
			</header>

			${pathname === "/" ? HERO_TEMPLATE : ""}

			<main class="layout__main _container">${pageTemplate}</main>

			<footer class="layout__footer _container">
				<ul class="layout__footer-list">
					<li class="layout__footer-item">
						<a class="layout__tg" href="https://t.me/aroma_chef" target="_blank">@aroma_chef</a>
					</li>
					${pathname === "/about" ? "" : ABOUT_TEMPLATE}
					<li class="layout__footer-item layout__footer-item--last">
						<a href="https://efiand.ru" target="_blank" rel="nofollow">Разработано efiand</a>
					</li>
				</ul>
			</footer>
		</body>
		</html>
	`;
}

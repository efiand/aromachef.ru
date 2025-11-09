import { BASE_URL, noAmpRoutes, PROJECT_TITLE, version } from "#common/constants.js";
import { renderLayout } from "#common/templates/layout.js";
import { renderDocumentTitle } from "#common/templates/title.js";
import { isDev } from "#server/constants.js";
import { renderAmpAssets } from "#server/lib/amp.js";

const IMPORTMAP = {
	imports: {
		"#client/": "/client/",
		"#common/": "/common/",
	},
};

function renderAssets() {
	return isDev
		? /* html */ `
			<link rel="stylesheet" href="/client/css/critical.css">
			<script type="importmap">${JSON.stringify(IMPORTMAP)}</script>
			<script src="/client/entries/dev.js" type="module"></script>
			<script src="/client/entries/main.js" type="module"></script>
		`
		: /* html */ `
			<link rel="stylesheet" href="/bundles/critical.css?v${version.CSS}">
			<script src="/bundles/main.js?v${version.JS}" defer></script>
		`;
}

/** @type {(pathname: string, isAmp: boolean) => string} */
function renderUrlMeta(pathname, isAmp) {
	if (!pathname) {
		return /* html */ `<meta name="robots" content="noindex, nofollow">`;
	}

	let ampTemplate = "";
	if (!isAmp && !noAmpRoutes.has(pathname)) {
		const ampUrl = pathname === "/" ? "/amp" : `/amp${pathname}`;
		ampTemplate = /* html */ `<link rel="ampurl" href="${BASE_URL}${ampUrl}">`;
	}

	return /* html */ `
		${ampTemplate}
		<link rel="canonical" href="${BASE_URL}${pathname}">
		<meta property="og:url" content="${pathname}">
	`;
}

/** @type {(data: LayoutData) => Promise<string>} */
export async function renderPage({
	isAmp = false,
	description,
	headTemplate = "",
	heading = "",
	ogImage = "/images/og.webp",
	pageTemplate = "",
	pathname = "",
}) {
	const title = renderDocumentTitle(heading);
	const assetsTemplate = isAmp ? await renderAmpAssets(pageTemplate.includes("<form")) : renderAssets();

	const template = /* html */ `
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

		${renderLayout({ isAmp, isDev, pageTemplate, pathname })}

		</html>
	`;

	return isAmp ? template.replace(/="\/(recipe|search|structure|tag)/g, '="/amp/$1') : template;
}

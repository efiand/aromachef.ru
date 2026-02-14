import { BASE_URL, PROJECT_TITLE, version } from "#common/constants.js";
import { noAmp } from "#common/lib/no-amp.js";
import { renderLayout } from "#common/templates/layout.js";
import { renderLayoutAdmin } from "#common/templates/layout-admin.js";
import { renderDocumentTitle } from "#common/templates/title.js";
import { isDev } from "#server/constants.js";
import { renderAmpAssets } from "#server/lib/amp.js";

const IMPORTMAP = {
	imports: {
		"#client/": "/client/",
		"#common/": "/common/",
	},
};

function renderAssets(isAdmin = false) {
	const bundleName = isAdmin ? "admin" : "main";

	return isDev
		? /* html */ `
			<link rel="stylesheet" href="/client/css/critical.css">
			${isAdmin ? /* html */ `<link rel="stylesheet" href="/client/css/admin.css">` : ""}
			<script type="importmap">${JSON.stringify(IMPORTMAP)}</script>
			<script src="/client/entries/dev.js" type="module"></script>
			<script src="/client/entries/${bundleName}.js" type="module"></script>
		`
		: /* html */ `
			<link rel="stylesheet" href="/bundles/critical.css?v${version.CSS}">
			${isAdmin ? /* html */ `<link rel="stylesheet" href="/bundles/admin.css?v${version.CSS}">` : ""}
			<script src="/bundles/${bundleName}.js?v${version.JS}" defer></script>
		`;
}

/** @type {(pathname: string, isAmp: boolean) => string} */
function renderUrlMeta(pathname, isAmp) {
	if (!pathname) {
		return /* html */ `<meta name="robots" content="noindex, nofollow">`;
	}

	let template = /* html */ `<meta property="og:url" content="${pathname}">`;
	if (!isAmp && !noAmp(pathname)) {
		const ampUrl = pathname === "/" ? "/amp" : `/amp${pathname}`;
		template += /* html */ `<link rel="ampurl" href="${BASE_URL}${ampUrl}">`;
	}
	if (!pathname.startsWith("/__")) {
		template += /* html */ `<link rel="canonical" href="${BASE_URL}${pathname}">`;
	}

	return template;
}

/** @type {(data: LayoutData) => Promise<string>} */
export async function renderPage({
	authorized,
	description,
	headTemplate = "",
	heading = "",
	isAmp = false,
	ogImage = "/images/og.webp",
	ogImageWidth = 544,
	ogImageHeight = 408,
	pageTemplate = "",
	pathname = "",
}) {
	const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
	const title = renderDocumentTitle(heading);
	const assetsTemplate = isAmp ? await renderAmpAssets(pageTemplate.includes("<form")) : renderAssets(isAdmin);
	const descriptionTemplate = description
		? /* html */ `
			<meta name="description" content="${description}">
			<meta property="og:description" content="${description}">
		`
		: "";

	const layoutTemplate = isAdmin
		? renderLayoutAdmin({ heading, pageTemplate, pathname })
		: renderLayout({ authorized, isAmp, isDev, pageTemplate, pathname });

	const template = /* html */ `
		<!DOCTYPE html>
		<html lang="ru" prefix="og: http://ogp.me/ns#" ${isAmp ? "⚡" : ""}>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="apple-mobile-web-app-title" content="${PROJECT_TITLE}">
			<meta name="apple-mobile-web-app-capable" content="yes">

			<title>${title}</title>
			${renderUrlMeta(pathname, isAmp)}
			<meta property="og:title" content="${title}">
			<meta property="og:locale" content="ru_RU">
			<meta property="og:type" content="website">
			<meta property="og:site_name" content="${PROJECT_TITLE}">
			<meta property="og:image" content="${ogImage}">
			<meta property="og:image:width" content="${ogImageWidth}">
			<meta property="og:image:height" content="${ogImageHeight}">

			${descriptionTemplate}
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

		${layoutTemplate}

		</html>
	`;

	return isAmp ? template.replace(/="\/(blog|recipe|search|structure|tag)/g, '="/amp/$1') : template;
}

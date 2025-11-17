import { HERO_TEMPLATE } from "#common/templates/hero.js";
import { YANDEX_METRIKA_TEMPLATE } from "#common/templates/yandex-metrika.js";

const ADMIN_TEMPLATE = /* html */ `
	<li class="footer__item"><a href="/admin">Панель управления</a></li>
`;

const SEARCH_TEMPLATE = /* html */ `
	<li class="header__item">
		<a class="header__extra header__extra--search" href="/search" data-async-search>
			<span>Поиск</span>
		</a>
	</li>
`;

/** @type {(ampPrefix: string) => string} */
function renderAboutTemplate(ampPrefix) {
	return /* html */ `
		<li class="footer__item">
			<a href="${ampPrefix}/about" rel="author">Обо мне</a>
		</li>
	`;
}

/** @type {(ampPrefix: string) => string} */
function renderImportantTemplate(ampPrefix) {
	return /* html */ `
		<li class="header__item">
			<a href="${ampPrefix}/important"><strong>Важно!</strong></a>
		</li>
	`;
}

/** @type {(data: LayoutData) => string} */
function renderLayoutInner({ authorized, isAmp, pathname, pageTemplate }) {
	const ampPrefix = isAmp ? "/amp" : "";
	const isIndex = pathname === "/";
	const ariaCurrentIndex = isIndex ? 'aria-current="page"' : "";

	return /* html */ `
		<header class="header layout__header _container">
			<a class="header__logo" href="${isAmp ? "/amp" : "/"}" aria-label="На главную" ${ariaCurrentIndex}>
				<img src="/images/aromachef-logo.svg?v2" width="30" height="30" alt="">
			</a>
			<ul class="header__list">
				<li class="header__item">
					<a class="header__structure" href="/structure">Разделы <span>и #теги</span></a>
				</li>
				${pathname === "/important" ? "" : renderImportantTemplate(ampPrefix)}
				${pathname === "/search" ? "" : SEARCH_TEMPLATE}
			</ul>
		</header>

		${isIndex ? HERO_TEMPLATE : ""}

		<main class="layout__main _container">${pageTemplate}</main>

		<footer class="footer layout__footer _container">
			<ul class="footer__list">
				<li class="footer__item">
					<a class="footer__tg" href="https://t.me/aroma_chef" target="_blank">@aroma_chef</a>
				</li>
				${pathname === "/about" ? "" : renderAboutTemplate(ampPrefix)}
				${authorized ? ADMIN_TEMPLATE : ""}
				<li class="footer__item footer__item--last">
					<a href="https://efiand.ru" target="_blank" rel="nofollow">Разработано efiand</a>
				</li>
			</ul>
		</footer>
	`;
}

/** @type {(data: LayoutData) => string} */
export function renderLayout({ authorized, isAmp, isDev, pathname, pageTemplate }) {
	return /* html */ `
		<body>
			${isDev || isAmp ? "" : YANDEX_METRIKA_TEMPLATE}
			<div class="layout" data-layout>
				${renderLayoutInner({ authorized, isAmp, pageTemplate, pathname })}
			</div>
		</body>
	`;
}

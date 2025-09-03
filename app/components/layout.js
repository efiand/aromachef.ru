import { YANDEX_METRIKA_TEMPLATE } from "#common/lib/yandex-metrika.js";
import { html } from "#common/utils/mark-template.js";
import { HERO_TEMPLATE } from "#components/hero.js";

const SEARCH_TEMPLATE = html`
	<li class="layout__header-item layout__header-item--separated">
		<a href="/search" data-search>Поиск</a>
	</li>
`;

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

/** @type {(data: LayoutDataBase) => string} */
export function renderLayout({ isAmp, isDev, pathname, pageTemplate }) {
	const ampPrefix = isAmp ? "/amp" : "";

	return html`
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
					${pathname === "/about" ? "" : renderAboutTemplate(ampPrefix)}
					<li class="layout__footer-item layout__footer-item--last">
						<a href="https://efiand.ru" target="_blank" rel="nofollow">Разработано efiand</a>
					</li>
				</ul>
			</footer>
		</body>
	`;
}

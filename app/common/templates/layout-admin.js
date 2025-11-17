/** @type {(data: LayoutData) => string} */
export function renderLayoutAdmin({ heading, pageTemplate, pathname }) {
	const menuTemplate =
		pathname === "/admin/auth"
			? ""
			: /* html */ `
				<ul class="header__list">
					<li class="header__item">
						<a class="header__structure" href="/admin">Панель управления</a>
					</li>
					<li class="header__item">
						<a class="header__extra header__extra--logout" href="/admin/logout">
							<span>Выход</span>
						</a>
					</li>
				</ul>
			`;

	return /* html */ `
		<body>
			<div class="layout">
				<header class="header layout__header _container">
					<a class="header__logo" href="/" aria-label="На главную">
						<img src="/images/aromachef-logo.svg?v2" width="30" height="30" alt="">
					</a>
					${menuTemplate}
				</header>

				<main class="layout__main _container">
					${heading ? /* html */ `<h1>${heading}</h1>` : ""}
					${pageTemplate}
				</main>
			</div>
		</body>
	`;
}

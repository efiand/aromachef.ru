<header class="header container">
	<a class="header__logo-link" href="/" aria-label="На главную">
		<svg class="header__logo" width="1.5rem" height="1.5rem" role="img">
			<use href="/images/aromachef-logo.svg#logo" />
		</svg>
	</a>

	<ul class="header__list">
		<li class="header__item">
			<a href="/structure">Разделы и #теги</a>
		</li>
		<li class="header__item">
			<a href="/important"><strong>Важно!</strong></a>
		</li>
	</ul>
</header>

<style lang="scss">
	.header {
		--gap: 1rem;

		position: sticky;
		top: 0;
		z-index: 1;
		display: flex;
		gap: var(--gap);
		padding-block: 0.5rem;
		font-family: var(--font-accent);
		text-transform: uppercase;
		background-color: var(--color-white);
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);

		@include tablet-desktop {
			--gap: 2rem;
		}
	}

	.header__logo-link {
		color: var(--color-eggplant);

		@include hover {
			color: var(--color-green);
		}
	}

	.header__logo {
		display: block;
	}

	.header__list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
	}

	.header__item {
		display: contents;
	}
</style>

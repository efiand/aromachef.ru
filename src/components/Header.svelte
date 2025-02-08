<script lang="ts">
	import { page } from '$app/state';
</script>

<header class="header _container">
	<a class="header__logo-link" href="/" aria-label="На главную">
		<svg class="header__logo" width="1.5rem" height="1.5rem" role="img">
			<use href="/images/aromachef-logo.svg#logo" />
		</svg>
	</a>

	<ul class="header__list">
		<li class="header__item">
			<a href="/structure">Разделы и #теги</a>
		</li>
		{#if page.route.id !== '/important'}
			<li class="header__item">
				<a href="/important"><strong>Важно!</strong></a>
			</li>
		{/if}
	</ul>
</header>

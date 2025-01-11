<script lang="ts">
	import { page } from '$app/state';
</script>

<footer class="footer container">
	<ul class="footer__list">
		<li class="footer__item">
			<a class="footer__tg" href="https://t.me/aroma_chef" target="_blank">
				@aroma_chef
			</a>
		</li>
		{#if page.route.id !== '/about'}
			<li class="footer__item">
				<a href="/about">Обо мне</a>
			</li>
		{/if}
		<li class="footer__item footer__item--last">
			Разработка:
			<a href="https://efiand.ru" target="_blank" rel="nofollow">efiand</a>
		</li>
	</ul>
</footer>

<style lang="scss">
	.footer {
		--link-color: var(--color-green-light);

		padding-block: 1.5rem;
		font-size: 0.75rem;
		line-height: 1.2rem;
		font-family: var(--font-accent);
		color: var(--color-white);
		background-color: var(--color-black);
	}

	.footer__list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		@include tablet-desktop {
			flex-direction: row;
			gap: 2rem;
		}
	}

	.footer__item {
		text-align: center;

		&--last {
			@include tablet-desktop {
				margin-left: auto;
			}
		}

		a {
			color: var(--link-color);
		}
	}

	.footer__tg {
		--link-color: var(--color-lavender);

		position: relative;
		display: block;
		padding-left: 1.5rem;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 1.2rem;
			height: 1.2rem;
			background-color: currentColor;
			mask-image: var(--icon-tg);
			mask-size: 1.2rem 1.2rem;
		}
	}
</style>

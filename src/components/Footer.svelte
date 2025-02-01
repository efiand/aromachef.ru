<script lang="ts">
	import { page } from '$app/state';
	import { TG_URL } from '@/lib/constants';
</script>

<footer class="footer container">
	<ul class="footer__list">
		<li class="footer__item">
			<a class="footer__tg" href={TG_URL} target="_blank">@aroma_chef</a>
		</li>
		{#if page.route.id !== '/about'}
			<li class="footer__item">
				<a href="/about">Обо мне</a>
			</li>
		{/if}
		<li class="footer__item footer__item--last">
			<a href="https://efiand.ru" target="_blank" rel="nofollow">
				Разработано efiand
			</a>
		</li>
	</ul>
</footer>

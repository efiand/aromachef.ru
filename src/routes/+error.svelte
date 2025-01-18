<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="content">
	<h1>Ошибка {page.status}</h1>

	{#if page.error}
		<p>{page.error.message}</p>
	{/if}

	<p>
		<a href="mailto:efiand@ya.ru?subject=aromachef">
			Связаться с разработчиком
		</a>
	</p>
</div>

<style lang="scss">
	h1 {
		margin-bottom: 2rem;
	}
</style>

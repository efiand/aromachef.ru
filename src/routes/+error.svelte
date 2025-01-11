<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="content">
	<h1>{page.status}</h1>

	{#if page.error}
		<p>{page.error.message}</p>
	{/if}
</div>

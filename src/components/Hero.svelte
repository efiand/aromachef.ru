<script lang="ts">
	import { typewriter } from '@/lib/transitions';
	import { onMount } from 'svelte';

	let showDescription = $state(false);

	onMount(function () {
		showDescription = true;
	});
</script>

<section class="hero">
	<h1 class="hero__heading">
		<svg width="1.6em" height="1.6em" role="img">
			<use href="/images/aromachef-logo.svg#logo" />
		</svg>

		АромаШеф
	</h1>

	{#if import.meta.env.SSR || showDescription}
		<p class="hero__text">
			<span in:typewriter>Готовим с эфирными маслами!</span>
		</p>
	{/if}
</section>

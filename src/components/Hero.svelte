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

<style lang="scss">
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		box-sizing: border-box;
		min-height: calc(100vh - 2.5rem);
		padding: 2rem;
		color: var(--color-eggplant);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			background-image: url('/images/hero.jpg');
			background-position: 50%;
			background-size: cover;
			opacity: 0.5;
		}
	}

	.hero__heading {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-end;
		gap: 1rem;
		font-family: var(--font-basic);
	}

	.hero__text {
		min-height: 1.875rem;
		font-size: 1.25rem;
		text-align: center;
	}
</style>

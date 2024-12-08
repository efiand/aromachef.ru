<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import '@/scss/index.scss';
	import Footer from '@/components/Footer.svelte';
	import Header from '@/components/Header.svelte';
	import Hero from '@/components/Hero.svelte';

	let { children } = $props();
	let appElement: HTMLDivElement;

	afterNavigate(function () {
		appElement.scrollTo({ behavior: 'instant', top: 0 });
	});
</script>

<div class="app" bind:this={appElement}>
	<Header />
	{#if $page.route.id === '/'}
		<Hero />
	{/if}

	<main class="app__main container">
		{@render children()}
	</main>

	<Footer />
</div>

<style lang="scss">
	.app {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden scroll;
		scroll-behavior: var(--scroll-behavior);
	}

	.app__main {
		flex-grow: 1;
		padding-block: 3rem;
	}
</style>

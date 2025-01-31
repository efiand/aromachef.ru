<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Footer from '@/components/Footer.svelte';
	import '@/scss/index.scss';
	import Header from '@/components/Header.svelte';
	import Hero from '@/components/Hero.svelte';
	import { hitYM } from '@/lib/ym';

	let { children } = $props();
	let appElement: HTMLDivElement;

	let title = $derived(
		['АромаШеф', page.data.title].filter(Boolean).join(' : ')
	);
	let url = $derived(`${page.url.origin}${page.url.pathname}`);
	let ogImage = $derived(
		page.data.ogImage
			? `/pictures/${page.data.ogImage}@2x.webp`
			: '/images/og.webp'
	);

	afterNavigate(function () {
		hitYM();
		appElement.scrollTo({ behavior: 'instant', top: 0 });
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={page.data.description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={page.data.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={ogImage} />
</svelte:head>

<div class="app" bind:this={appElement}>
	<Header />
	{#if page.route.id === '/'}
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

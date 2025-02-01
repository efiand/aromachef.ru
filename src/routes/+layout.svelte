<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Footer from '@/components/Footer.svelte';
	import Header from '@/components/Header.svelte';
	import '@/scss/index.scss';
	import Hero from '@/components/Hero.svelte';
	import { BASE_AMP_URL, BASE_URL } from '@/lib/constants';
	import { hitYM } from '@/lib/ym';

	let { children } = $props();
	let appElement: HTMLDivElement;

	let title = $derived(
		['АромаШеф', page.data.title].filter(Boolean).join(' : ')
	);
	let url = $derived(`${BASE_URL}${page.url.pathname}`);
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

	{#if page.url.hostname === 'aromachef.ru'}
		<link rel="amphtml" href="{BASE_AMP_URL}{page.url.pathname}" />
	{/if}
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

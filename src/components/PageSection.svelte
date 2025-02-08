<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = '',
		title
	}: {
		children: Snippet;
		class?: string;
		title: string;
	} = $props();
</script>

<section class="page-section {className}">
	<h1 class="page-section__title">{@html title}</h1>

	{@render children()}
</section>

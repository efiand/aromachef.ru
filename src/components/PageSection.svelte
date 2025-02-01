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
	<h1>{@html title}</h1>
	{@render children()}
</section>

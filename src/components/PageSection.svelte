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

<style lang="scss">
	.page-section {
		display: grid;
		gap: 3rem;

		@include tablet-desktop {
			gap: 4rem;
		}
	}
</style>

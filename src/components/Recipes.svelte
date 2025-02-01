<script lang="ts">
	import type { Item } from '@/types';

	import Cards from '@/components/Cards.svelte';

	let {
		alt = '',
		items,
		title
	}: {
		alt?: string;
		items: Item[];
		title: string;
	} = $props();
</script>

<section class="recipes">
	<h1 class="recipes__heading">{title}</h1>
	<Cards {items} centered entity="recipe" {alt} />
</section>

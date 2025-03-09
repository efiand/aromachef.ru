<script lang="ts">
	import type { Item } from '@/types';

	import Image from '@/components/Image.svelte';

	let {
		alt = '',
		centered = false,
		centeredInMobile = false,
		entity,
		items
	}: {
		alt?: string;
		centered?: boolean;
		centeredInMobile?: boolean;
		entity: 'recipe' | 'structure';
		items: Item[];
	} = $props();

	let modifier = $derived.by(function () {
		if (centeredInMobile) {
			return 'cards--centered-in-mobile';
		}
		if (centered) {
			return 'cards--centered';
		}
		return '';
	});
</script>

<ul class="cards {modifier}">
	{#each items as { id, title } (id)}
		{@const href = `/${entity}/${id}`}
		<li class="cards__item">
			<a {href}>
				<Image name="{entity}/{id}" width="272" height="204" {alt} />
			</a>
			<a {href}>{@html title}</a>
		</li>
	{/each}
</ul>

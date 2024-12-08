<script lang="ts">
	import type { Item } from '@/types';

	import Image from '@/components/Image.svelte';

	let {
		alt = '',
		centered = false,
		entity,
		items
	}: {
		alt?: string;
		centered?: boolean;
		entity: 'recipe' | 'structure';
		items: Item[];
	} = $props();
</script>

<ul class="cards {centered ? 'cards--centered' : ''}">
	{#each items as { id, title }}
		{@const href = `/${entity}/${id}`}
		<li class="cards__item">
			<a {href}>
				<Image name="{entity}/{id}" width="272" height="204" {alt} />
			</a>
			<a {href}>{@html title}</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	.cards {
		display: flex;
		flex-wrap: wrap;
		gap: 2.125rem;

		&--centered {
			justify-content: center;
		}
	}

	.cards__item {
		display: grid;
		align-content: start;
		gap: 0.5rem;
		width: 272px;
		font-family: var(--font-basic);
		text-align: center;

		:global(img) {
			height: 204px;
			object-fit: cover;
			object-position: center;
		}

		a:hover + a {
			text-decoration: underline;
		}
	}
</style>

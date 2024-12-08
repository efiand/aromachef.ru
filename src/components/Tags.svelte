<script lang="ts">
	import type { Item } from '@/types';

	let { column = false, tags }: { column?: boolean; tags: Item[] } = $props();
</script>

<ul class="tags {column ? 'tags--column' : ''}">
	{#each tags as { id, title }}
		<li class="tags__item">
			<a href="/tag/{id}">#{title}</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;

		&--column {
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	.tags__item {
		display: contents;

		a {
			text-transform: lowercase;
		}
	}
</style>

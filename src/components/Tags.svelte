<script lang="ts">
	import type { Item } from '@/types';

	let {
		class: className = '',
		column = false,
		tags
	}: { class?: string; column?: boolean; tags: Item[] } = $props();
</script>

<ul class="tags {column ? 'tags--column' : ''} {className}">
	{#each tags as { id, title } (id)}
		<li class="tags__item">
			<a class="tags__link" href="/tag/{id}">#{title}</a>
		</li>
	{/each}
</ul>

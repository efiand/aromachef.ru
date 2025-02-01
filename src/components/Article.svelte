<script lang="ts">
	import type { Snippet } from 'svelte';

	import Image from '@/components/Image.svelte';

	let {
		children,
		imageAlt = '',
		imageName,
		reverse = false,
		title
	}: {
		children: Snippet;
		imageAlt?: string;
		imageName: string;
		reverse?: boolean;
		title?: string;
	} = $props();
</script>

<div class="article {reverse ? 'article--reverse' : ''}">
	<div class="content">
		{#if title}
			<h2>{title}</h2>
		{/if}
		{@render children()}
	</div>
	<div class="article__image">
		<Image name={imageName} width="384" height="672" alt={imageAlt} />
	</div>
</div>

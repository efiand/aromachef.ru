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

<style lang="scss">
	.article {
		display: grid;
		gap: 2rem;

		@include tablet-desktop {
			grid-template-columns: 384px 1fr;

			.article__image {
				order: -1;
			}
		}

		&--reverse {
			@include tablet-desktop {
				grid-template-columns: 1fr 384px;

				.article__image {
					order: initial;
				}
			}
		}
	}

	.article__image {
		@include tablet-desktop {
			margin-top: 0.75rem;
		}
	}
</style>

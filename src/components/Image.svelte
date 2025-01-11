<script lang="ts">
	import { PICTURE_URL } from '@/lib/constants';

	let {
		alt = '',
		height,
		name,
		width
	}: {
		alt?: string;
		height?: string;
		name: string;
		width?: string;
	} = $props();
</script>

<img
	class="image"
	src="{PICTURE_URL}/{name}@1x.webp"
	srcset="{PICTURE_URL}/{name}@2x.webp 2x"
	{width}
	{height}
	{alt}
	loading="lazy"
/>

<style lang="scss">
	.image {
		display: block;
		color: transparent;
		background-color: var(--color-green-light);
		border-radius: 2px;
	}
</style>

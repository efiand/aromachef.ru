<script lang="ts">
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
	src="/images/{name}@1x.webp"
	srcset="/images/{name}@2x.webp 2x"
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

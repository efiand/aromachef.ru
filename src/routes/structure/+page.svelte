<script lang="ts">
	import { page } from '$app/state';
	import Cards from '@/components/Cards.svelte';
	import Tags from '@/components/Tags.svelte';

	let { items = [], tags = [] } = $derived(page.data);
</script>

<section class="structure">
	<div>
		<h1 class="structure__heading">Разделы</h1>
		<Cards
			{items}
			entity="structure"
			alt="На фото изображено готовое блюдо из этого раздела в миниатюре."
		/>
	</div>

	<div class="structure__tags" id="tags">
		<h2 class="structure__sideheading">Теги</h2>
		<Tags {tags} column />
	</div>
</section>

<style lang="scss">
	.structure {
		display: grid;
		gap: 2rem;

		@include tablet-desktop {
			grid-template-columns: 1fr min-content;
		}
	}

	.structure__heading {
		margin-bottom: 2rem;
	}

	.structure__sideheading {
		margin: 1rem 0 2rem;
	}

	.structure__tags {
		scroll-margin-top: 2rem;
	}
</style>

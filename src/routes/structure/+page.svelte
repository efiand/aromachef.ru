<script lang="ts">
	import { page } from '$app/stores';
	import Cards from '@/components/Cards.svelte';
	import Tags from '@/components/Tags.svelte';

	let { items = [], tags = [] } = $page.data;
</script>

<svelte:head>
	<title>АромаШеф : Разделы и #теги</title>
</svelte:head>

<section class="structures">
	<div>
		<h1 class="structures__heading">Разделы</h1>
		<Cards
			{items}
			entity="structure"
			alt="На фото изображено готовое блюдо из этого раздела в миниатюре."
		/>
	</div>

	<div>
		<h2 class="structures__sideheading">Теги</h2>
		<Tags {tags} column />
	</div>
</section>

<style lang="scss">
	.structures {
		display: grid;
		gap: 2rem;

		@include tablet-desktop {
			grid-template-columns: 1fr min-content;
		}
	}

	.structures__heading {
		margin-bottom: 2rem;
	}

	.structures__sideheading {
		margin: 1rem 0 2rem;
	}
</style>

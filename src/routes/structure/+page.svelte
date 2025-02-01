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

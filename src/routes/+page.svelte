<script lang="ts">
	import { page } from '$app/state';

	import Recipes from '@/components/Recipes.svelte';

	let { items = [] } = $derived(page.data);
</script>

<Recipes
	{items}
	title="Новые рецепты с эфирными маслами"
	alt="На фото изображено готовое блюдо в миниатюре."
/>

<a class="_centered _separated" href="/structure">Все рецепты</a>

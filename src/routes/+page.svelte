<script lang="ts">
	import { page } from '$app/stores';
	import Recipes from '@/components/Recipes.svelte';

	let { items = [] } = $page.data;
</script>

<svelte:head>
	<title>АромаШеф</title>
</svelte:head>

<Recipes
	{items}
	title="Новые рецепты"
	alt="На фото изображено готовое блюдо в миниатюре."
/>

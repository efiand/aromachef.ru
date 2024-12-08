<script lang="ts">
	import { page } from '$app/stores';
	import Recipes from '@/components/Recipes.svelte';

	let { entity, items = [] } = $page.data;
	let title = `#${entity?.title}`;
</script>

<svelte:head>
	<title>АромаШеф : Теги : {title}</title>
</svelte:head>

<Recipes
	{title}
	{items}
	alt="На фото изображено готовое блюдо по этому тегу в миниатюре."
/>

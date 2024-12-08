<script lang="ts">
	import { page } from '$app/stores';
	import Recipes from '@/components/Recipes.svelte';

	let { entity, items = [] } = $page.data;
</script>

<svelte:head>
	<title>АромаШеф : Разделы : {entity?.title}</title>
</svelte:head>

<Recipes
	title={entity!.title}
	{items}
	alt="На фото изображено готовое блюдо из этого раздела в миниатюре."
/>

<script lang="ts">
	import { page } from '$app/state';

	import Recipes from '@/components/Recipes.svelte';

	let { entity, items = [] } = $derived(page.data);
</script>

<Recipes
	title="#{entity!.title}"
	{items}
	alt="На фото изображено готовое блюдо по этому тегу в миниатюре."
/>

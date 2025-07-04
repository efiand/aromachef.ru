<script lang="ts">
	import { page } from '$app/state';

	import type { ItemWrapper } from '@/types';

	import Article from '@/components/Article.svelte';
	import PageSection from '@/components/PageSection.svelte';
	import Tags from '@/components/Tags.svelte';

	let { id } = $derived(page.params);
	let { cooking, enrichedDescription, ingredients, structure, tags, title } =
		$derived(page.data.recipe!);

	function tagWrapperToTag({ tag }: ItemWrapper) {
		return tag;
	}
</script>

<PageSection class="recipe" {title}>
	<div class="content">{@html enrichedDescription}</div>

	<Article
		title="Состав"
		imageName="recipe/{id}-ingredients"
		imageAlt="На фото изображены ингредиенты."
	>
		{@html ingredients}
	</Article>

	<Article
		title="Приготовление"
		imageName="recipe/{id}-cooking"
		imageAlt="На фото изображено готовое блюдо."
		reverse
	>
		{@html cooking}
	</Article>

	<div class="recipe__footer">
		<Tags tags={tags.map(tagWrapperToTag)} />
		<a class="recipe__structure-link" href="/structure/{structure.id}">
			{structure.title}
		</a>
	</div>
</PageSection>

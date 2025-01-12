<script lang="ts">
	import type { ItemWrapper } from '@/types';

	import { page } from '$app/state';
	import Article from '@/components/Article.svelte';
	import PageSection from '@/components/PageSection.svelte';
	import Tags from '@/components/Tags.svelte';
	import { TG_URL } from '@/lib/constants';

	let { id } = $derived(page.params);
	let {
		cooking,
		description,
		ingredients,
		structure,
		tags,
		telegramId,
		title
	} = $derived(page.data.recipe!);

	function tagWrapperToTag({ tag }: ItemWrapper) {
		return tag;
	}
</script>

<PageSection class="recipe" {title}>
	{#if description || telegramId}
		<div class="content">
			{#if description}
				{@html description}
			{/if}
			{#if telegramId}
				<!-- prettier-ignore -->
				<p>
					Краткая видеоинструкция доступна по
					<a href="{TG_URL}/{telegramId}" target="_blank" rel="nofollow noopener">
						ссылке
					</a>.
				</p>
				<!-- prettier-ignore-end -->
			{/if}
		</div>
	{/if}

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
		<a href="/structure/{structure.id}">{structure.title}</a>
	</div>
</PageSection>

<style lang="scss">
	.recipe__footer {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;

		@include tablet-desktop {
			flex-direction: row;
		}
	}
</style>

<script lang="ts">
	import type { ItemWrapper } from '@/types';

	import { page } from '$app/stores';
	import Image from '@/components/Image.svelte';
	import Tags from '@/components/Tags.svelte';

	let { id } = $page.params;
	let { recipe } = $page.data;
	let { structure } = recipe!;

	function tagWrapperToTag({ tag }: ItemWrapper) {
		return tag;
	}
</script>

<svelte:head>
	<title>АромаШеф : Рецепты : {recipe?.title}</title>
</svelte:head>

<section class="recipe">
	<h1>{@html recipe?.title}</h1>

	<div class="recipe__cols">
		<div class="content">
			<h2>Состав</h2>
			{@html recipe?.ingredients}
		</div>
		<div class="recipe__image">
			<Image
				name="recipe/{id}-ingredients"
				width="384"
				height="672"
				alt="На фото изображены ингредиенты."
			/>
		</div>
	</div>
	<div class="recipe__cols">
		<div class="content">
			<h2>Приготовление</h2>
			{@html recipe?.cooking}
		</div>
		<div class="recipe__image">
			<Image
				name="recipe/{id}-cooking"
				width="384"
				height="672"
				alt="На фото изображено готовое блюдо."
			/>
		</div>
	</div>

	<div class="recipe__footer">
		<Tags tags={recipe!.tags.map(tagWrapperToTag)} />
		<a href="/structure/{structure.id}">{structure.title}</a>
	</div>
</section>

<style lang="scss">
	.recipe {
		display: grid;
		gap: 3rem;

		@include tablet-desktop {
			gap: 4rem;
		}
	}

	.recipe__cols {
		display: grid;
		gap: 2rem;

		@include tablet-desktop {
			grid-template-columns: 1fr 384px;
		}

		&:first-of-type {
			@include tablet-desktop {
				grid-template-columns: 384px 1fr;

				.recipe__image {
					order: -1;
				}
			}
		}
	}

	.recipe__image {
		@include tablet-desktop {
			margin-top: 0.75rem;
		}
	}

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

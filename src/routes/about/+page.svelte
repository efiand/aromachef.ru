<script lang="ts">
	import { page } from '$app/state';
	import Article from '@/components/Article.svelte';
	import PageSection from '@/components/PageSection.svelte';
	import { PICTURE_URL } from '@/lib/constants';
</script>

<PageSection title={page.data.title}>
	<Article imageName="common/about">
		<p>
			Здравствуйте! Я очень рада, что вы заглянули в гости на мою Аромакухню.
		</p>

		<!-- prettier-ignore -->
		<p>
			Меня зовут Ольга. Я сертифицированный специалист по <a
				href="{PICTURE_URL}/common/aromachef-cert.webp"
				target="_blank"
			>АромаТестированию</a> и
			<a
				href="https://fs-thb03.getcourse.ru/fileservice/file/thumbnail/h/b92216eef2409b7e6286a70f15ddd5e1.png/s/800x/a/559935/sc/196"
				target="_blank"
				rel="nofollow noopener"
			>эфирным маслам doTERRA</a>.
			А ещё я очень люблю готовить.
		</p>
		<!-- prettier-ignore-end -->

		<p>
			Хозяйки знают, что самое сложное в приготовлении еды — это каждый день
			готовить вкусно и разнообразно, использовать при этом самые простые
			и доступные продукты и не тратить на приготовление еды много времени.
			Раньше в этом помогали специи и травы, а теперь на помощь пришли и эфирные
			масла.
		</p>
		<p>
			У меня накопилось много быстрых, простых и интересных рецептов
			с использованием эфирных масел. И коллекция постоянно пополняется, ведь
			мир кулинарии, как и мир эфирных масел, просто бесконечен.
		</p>
		<p>
			Я очень надеюсь, что мои рецепты помогут вам полезно, вкусно
			и разнообразно кормить своих родных и близких. И помните, что рецепт — это
			всего лишь идея, вы легко можете адаптировать любые рецепты под вкусы
			своей семьи.
		</p>
		<p>Давайте готовить с эфирными маслами вместе!</p>
	</Article>
</PageSection>

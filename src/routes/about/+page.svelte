<script lang="ts">
	import { page } from '$app/state';
	import Article from '@/components/Article.svelte';
	import PageSection from '@/components/PageSection.svelte';
</script>

<PageSection title={page.data.title}>
	<Article imageName="common/about">{@html page.data.content}</Article>
</PageSection>

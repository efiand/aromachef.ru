<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';

	import { enhance } from '$app/forms';
	import Button from '@/components/Button.svelte';

	let { form } = $props();

	const title = 'Панель управления';
	let disabled = $state(false);

	function createDump(): ReturnType<SubmitFunction> {
		disabled = true;

		return function ({ update }) {
			disabled = false;
			update();
		};
	}
</script>

<svelte:head>
	<title>АромаШеф : {title}</title>
</svelte:head>

<section class="admin">
	<h1 class="admin__heading">{title}</h1>

	<form method="POST" action="?/dump" use:enhance={createDump}>
		<Button type="submit" {disabled}>Резервное копирование</Button>
	</form>

	{#if !disabled && form?.success}
		<p class="admin__status">Резервное копирование успешно завершено!</p>
	{/if}
</section>

<style lang="scss">
	.admin__heading {
		margin-bottom: 2rem;
	}

	.admin__status {
		margin: 2rem 0 0;
	}
</style>

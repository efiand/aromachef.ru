<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';

	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Button from '@/components/Button.svelte';

	let { form } = $props();
	let disabled = $state(false);

	function createDump(): ReturnType<SubmitFunction> {
		disabled = true;

		return function ({ update }) {
			disabled = false;
			update();
		};
	}
</script>

<section class="admin">
	<h1 class="admin__heading">{page.data.title}</h1>

	<form method="POST" action="?/dump" use:enhance={createDump}>
		<Button type="submit" {disabled}>Резервное копирование</Button>
	</form>

	{#if !disabled && form?.success}
		<p class="admin__status">Резервное копирование успешно завершено!</p>
	{/if}
</section>

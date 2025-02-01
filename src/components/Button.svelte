<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		disabled = false,
		onclick = function () {},
		type = 'button'
	}: {
		children: Snippet;
		disabled?: boolean;
		onclick?: HTMLButtonElement['onclick'];
		type?: HTMLButtonElement['type'];
	} = $props();
</script>

<button class="button" {type} {disabled} {onclick}>{@render children()}</button>

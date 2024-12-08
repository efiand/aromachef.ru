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

<style lang="scss">
	.button {
		padding: 0.75rem 1.5rem;
		font: inherit;
		font-family: var(--font-accent);
		color: var(--color-white);
		background-color: var(--color-green);
		border: none;
		border-radius: 2px;
		transition: var(--transition);
		transition-property: background-color;
		cursor: pointer;
		user-select: none;

		@include hover {
			background-color: var(--color-eggplant);
		}

		&:disabled {
			opacity: 0.5;
			pointer-events: none;
		}
	}
</style>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let value = '';

	const inputClass =
		'border-none bg-transparent placeholder-gray-300 focus:ring-transparent dark:bg-transparent dark:text-white dark:placeholder-gray-600 dark:caret-white dark:focus:ring-transparent';
</script>

<input
	{...$$restProps}
	class={twMerge(inputClass, $$props.class)}
	inputmode="decimal"
	autocomplete="off"
	autocorrect="off"
	type="text"
	pattern="^[0-9]*[.,]?[0-9]*$"
	placeholder="0"
	minlength="1"
	maxlength="79"
	spellcheck="false"
	bind:value
	on:change
	on:input
/>

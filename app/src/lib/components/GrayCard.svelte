<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let label = '';

	const containerClass = 'flex flex-col items-start rounded-2xl bg-gray-100 p-4 dark:bg-gray-800';
</script>

<div class={twMerge(containerClass, $$props.class)}>
	{#if label !== ''}
		<span class="text-sm text-gray-500 dark:text-gray-400">{label}</span>
	{/if}
	<slot />
</div>

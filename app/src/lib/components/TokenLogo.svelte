<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import { Logo } from '$lib/components';
	import { twMerge } from 'tailwind-merge';

	export let symbol = 'ZIG';
	export let size = 'md';

	export let classIcon = '';
	export let classLabel = '';
	$: iconClass = size === 'xs' ? 'h-3 w-3' : '';
</script>

{#if symbol === 'DOT'}
	<img
		class={twMerge('h-10 w-10', iconClass, classIcon)}
		src="/polkadot-logo.png"
		alt="Polkadot Logo"
	/>
{:else if symbol === 'ETH'}
	<img
		class={twMerge('h-10 w-10', iconClass, classIcon)}
		src="/ethereum-eth.svg"
		alt="Ethereum Logo"
	/>
{:else if symbol === 'ATOM'}
	<img
		class={twMerge('h-10 w-10', iconClass, classIcon)}
		src="/cosmos-atom-logo.png"
		alt="Cosmos Hub Logo"
	/>
{:else}
	<Avatar {...$$restProps} class={twMerge('bg-gray-300 dark:bg-gray-700', $$props.class)} {size}>
		{#if symbol === 'ZIG'}
			<Logo class={twMerge(iconClass, classIcon)} />
		{:else}
			<span class={twMerge('text-sm', classLabel)}
				>{size === 'xs' ? Array.from(symbol)[0] : symbol}</span
			>
		{/if}
	</Avatar>
{/if}

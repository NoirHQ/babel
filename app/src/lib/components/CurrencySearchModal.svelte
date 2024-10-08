<script lang="ts">
	import type { ModalPlacementType } from 'flowbite-svelte';
	import { Modal, Search } from 'flowbite-svelte';
	import { TokenLogo } from '$lib/components';
	import { ZIG, RAT } from '$lib/constants';
	import { Token } from '$lib/types';

	export let open = false;
	export let onSelectCurrency = (_: Token) => {};
	export let searchTerm = '';
	export let items = [ZIG, RAT];

	let innerWidth = 0;
	$: placement = (innerWidth < 768 ? 'bottom-center' : 'center') as ModalPlacementType;

	$: filteredItems = items.filter((item) =>
		item.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>

<svelte:window bind:innerWidth />

<Modal
	title="Select a token"
	class="h-auto overflow-hidden rounded-none rounded-t-2xl border border-white
	border-opacity-10 md:w-[400px] md:rounded-b-2xl dark:divide-white
	dark:divide-opacity-10 dark:border-white dark:border-opacity-10 dark:bg-gray-900"
	bind:open
	{placement}
	autoclose
	outsideclose
	classDialog="p-0 h-screen"
	classHeader="bg-transparent dark:bg-transparent"
	classBody="p-0 md:p-0"
	classBackdrop="bg-gray-900"
>
	<div class="flex h-[60dvh] flex-col items-stretch md:h-[700px]">
		<div class="p-4">
			<Search
				class="rounded-full border-none focus:ring-transparent dark:bg-gray-800
				dark:focus:ring-transparent"
				size="md"
				bind:value={searchTerm}
				placeholder="Search tokens"
			/>
		</div>
		{#each filteredItems as item}
			<button
				class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
				on:click={() => {
					onSelectCurrency(item);
					open = false;
				}}
			>
				<div class="flex items-center gap-3">
					<TokenLogo symbol={item.symbol} />
					<div class="flex flex-col items-start">
						<span class="font-medium">{item.name}</span>
						<span class="text-sm">{item.symbol}</span>
					</div>
				</div>
			</button>
		{/each}
	</div>
</Modal>

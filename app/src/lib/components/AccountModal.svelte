<script lang="ts">
	import type { ModalPlacementType } from 'flowbite-svelte';
	import { Modal } from 'flowbite-svelte';
	import { AccountDetails, WalletSelector } from '$lib/components';
	import { account } from '$lib/store';

	export let open = false;

	let innerWidth = 0;
	$: placement = (innerWidth < 768 ? 'bottom-center' : 'center') as ModalPlacementType;

	$: address = truncateAddress($account);

	function truncateAddress(address: string | null): string {
		if (address === null) {
			return '';
		} else if (address.startsWith('0x')) {
			return `${address.slice(0, 6)}...${address.slice(-4)}`;
		} else if (address.startsWith('cosmos1')) {
			return `${address.slice(0, 11)}...${address.slice(-4)}`;
		} else {
			return `${address.slice(0, 4)}...${address.slice(-4)}`;
		}
	}
</script>

<svelte:window bind:innerWidth />

<Modal
	title={$account === null ? 'Sign in' : address}
	class="h-auto overflow-hidden rounded-none rounded-t-2xl border border-white border-opacity-10
	md:w-[400px] md:rounded-b-2xl dark:divide-white dark:divide-opacity-10 dark:border-white dark:border-opacity-10 dark:bg-gray-900"
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
		{#if $account === null}
			<WalletSelector bind:open />
		{:else}
			<AccountDetails bind:open />
		{/if}
	</div>
</Modal>

<script lang="ts">
	import type { ModalPlacementType } from '$lib/flowbite';
	import { Modal } from '$lib/flowbite';
	import { AccountDetails, WalletSelector } from '$lib/components';
	import { account, addresses, polkadotJsApi as api } from '$lib/store';
	import { bech32, hex } from '@scure/base';
	import { ethers } from 'ethers';

	export let open = false;

	let innerWidth = 0;
	$: placement = (innerWidth < 768 ? 'bottom-center' : 'center') as ModalPlacementType;

	$: getAddresses($account).then((res) => {
		$addresses = res;
	});

	async function fetchAddresses(accountId) {
		let res = [];
		let map = await $api.query.addressMap.map(accountId);
		map.forEach((value) => {
			value = value.toHuman();
			if (value.hasOwnProperty('Cosmos')) {
				res.push(bech32.encodeFromBytes('cosmos', hex.decode(value.Cosmos.substr(2))));
			} else if (value.hasOwnProperty('Ethereum')) {
				res.push(ethers.getAddress(value.Ethereum));
			}
		});
		return res;
	}

	async function getAddresses(address: string) {
		if (address === null || $api === null) {
			return [];
		} else if (address.startsWith('0x')) {
			let accountId = await $api.query.addressMap.index({ Ethereum: address });
			accountId = accountId.toHuman();
			if (accountId === null) return [];
			let res = await fetchAddresses(accountId);
			res.push(accountId);
			return res;
		} else if (address.startsWith('cosmos1')) {
			let accountId = await $api.query.addressMap.index({
				Cosmos: bech32.fromWords(bech32.decode(address).words)
			});
			accountId = accountId.toHuman();
			if (accountId === null) return [];
			let res = await fetchAddresses(accountId);
			res.push(accountId);
			return res;
		} else {
			const accountId = address;
			let res = await fetchAddresses(accountId);
			res.push(accountId);
			return res;
		}
	}
</script>

<svelte:window bind:innerWidth />

<Modal
	title={$account === null ? 'Connect a wallet' : 'Account Deatils'}
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

<script lang="ts">
	import { goto } from '$app/navigation';
	import { ethers } from 'ethers';
	import { IERC20 } from '$lib/abi';
	import { TokenLogo } from '$lib/components';
	import { ZIG } from '$lib/constants';
	import { account, addresses, toast } from '$lib/store';
	import { CurrencyAmount } from '$lib/types';
	import { ethersProvider, tokenSymbolFromAddress } from '$lib/utils';

	export let open = false;
	let innerWidth = 0;

	function copyAddressToClipboard(address: string | null) {
		if (address === null) return;
		navigator.clipboard.writeText(address);
		$toast.message = 'Copied to clipboard';
		$toast.dismissable = false;
		$toast.status = true;
		setTimeout(() => {
			$toast.status = false;
		}, 2000);
		open = false;
	}

	$: truncatedAccount = truncateAddress($account, innerWidth);
	$: truncatedAddresses = $addresses.map((a) => truncateAddress(a, innerWidth));

	function truncateAddress(address: string | null, innerWidth: number): string | null {
		if (address === null) return null;
		const chars = innerWidth >= 768 ? 32 : 28;
		if (address.length > chars) {
			return `${address.slice(0, chars / 2)}...${address.slice(-(chars / 2))}`;
		} else {
			return address;
		}
	}

	const currency = ZIG;
	let balance = '';
	$: owner = $addresses.find((a) => a.startsWith('0x'));

	let timeoutId: undefined | ReturnType<typeof setTimeout>;
	let contract: ethers.Contract | null = null;
	$: {
		contract = new ethers.Contract(currency.address, IERC20, ethersProvider);
		fetchBalance(owner);
	}

	async function fetchBalance(owner?: string) {
		timeoutId = undefined;
		if (!owner || !contract) return;
		contract.balanceOf(owner).then(
			(value) => {
				balance = CurrencyAmount.fromRawAmount(currency, value.toString()).toSignificant(6);
				timeoutId = setTimeout(() => fetchBalance(owner), 3000);
			},
			() => {}
		);
	}
</script>

<svelte:window bind:innerWidth />

<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Account</span>
<div class="flex flex-col items-stretch gap-px px-4">
	<button
		class="h-16 rounded-xl bg-gray-100 px-4 py-3 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
		on:click={() => copyAddressToClipboard($account)}
	>
		<div class="flex items-center gap-3">
			<TokenLogo symbol={tokenSymbolFromAddress($account)} size="md" />
			<span class="overflow-hidden text-ellipsis text-sm">{truncatedAccount}</span>
		</div>
	</button>
</div>
<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Balance</span>
<div class="flex flex-col items-stretch gap-px px-4">
	<button
		class="h-16 rounded-xl bg-gray-100 px-4 py-3 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
		on:click={() => {
			goto('/swap');
			open = false;
		}}
	>
		<div class="flex items-center gap-3">
			<TokenLogo symbol={currency.symbol} />
			<span class="grow text-right text-sm">{balance}</span>
			<span class="text-sm font-semibold text-black dark:text-white">ZIG</span>
		</div>
	</button>
</div>
<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Mapped Addresses</span
>
<div class="flex flex-col items-stretch gap-px px-4 pb-4">
	{#if $addresses.length === 0}
		<button
			class="h-16 bg-gray-100 px-4 py-3 first:rounded-t-xl
			last:rounded-b-xl only:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
		>
			<div class="flex items-center gap-3">
				<span class="overflow-hidden text-ellipsis text-sm"
					>Non-unified or non-ECDSA account</span
				>
			</div>
		</button>
	{/if}
	{#each $addresses as address, i}
		{#if address !== $account}
			<button
				class="h-16 bg-gray-100 px-4 py-3 first:rounded-t-xl
				last:rounded-b-xl only:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
				on:click={() => copyAddressToClipboard(address)}
			>
				<div class="flex items-center gap-3">
					<TokenLogo symbol={tokenSymbolFromAddress(address)} />
					<span class="overflow-hidden text-ellipsis text-sm"
						>{truncatedAddresses[i]}</span
					>
				</div>
			</button>
		{/if}
	{/each}
</div>

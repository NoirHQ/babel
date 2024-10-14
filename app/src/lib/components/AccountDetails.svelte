<script lang="ts">
	import { TokenLogo } from '$lib/components';
	import { account, addresses, toast } from '$lib/store';
	import { tokenSymbolFromAddress } from '$lib/utils';

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
<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Mapped Addresses</span
>
<div class="flex flex-col items-stretch gap-px px-4">
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

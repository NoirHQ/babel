<script lang="ts">
	import { TokenLogo } from '$lib/components';
	import { account, toast } from '$lib/store';

	export let open = false;
	export let addresses = [];

	function symbol(address: string | null) {
		if (address === null) {
			return 'ZIG';
		} else if (address.startsWith('0x')) {
			return 'ETH';
		} else if (address.startsWith('cosmos1')) {
			return 'ATOM';
		} else {
			return 'DOT';
		}
	}
</script>

<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Account</span>
<div class="flex flex-col items-stretch gap-px px-4">
	<button
		class="h-16 rounded-xl bg-gray-100 px-4 py-3 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
		on:click={() => {
			if ($account !== null) {
				navigator.clipboard.writeText($account);
				$toast.message = 'Copied to clipboard';
				$toast.status = true;
				setTimeout(() => {
					$toast.status = false;
				}, 2000);
				open = false;
			}
		}}
	>
		<div class="flex items-center gap-3">
			<TokenLogo symbol={symbol($account)} />
			<span class="overflow-hidden text-ellipsis text-sm">{$account}</span>
		</div>
	</button>
</div>
<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Mapped Addresses</span
>
<div class="flex flex-col items-stretch gap-px px-4">
	{#if addresses.length === 0}
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
	{#each addresses as address}
		<button
			class="h-16 bg-gray-100 px-4 py-3 first:rounded-t-xl
			last:rounded-b-xl only:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
			on:click={() => {
				if ($account !== null) {
					navigator.clipboard.writeText(address);
					$toast.message = 'Copied to clipboard';
					$toast.status = true;
					setTimeout(() => {
						$toast.status = false;
					}, 2000);
					open = false;
				}
			}}
		>
			<div class="flex items-center gap-3">
				<TokenLogo symbol={symbol(address)} />
				<span class="overflow-hidden text-ellipsis text-sm">{address}</span>
			</div>
		</button>
	{/each}
</div>

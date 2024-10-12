<script lang="ts">
	import { ethers } from 'ethers';
	import { IERC20 } from '$lib/abi';
	import { GrayCard, NumericalInput } from '$lib/components';
	import { account, addresses } from '$lib/store';
	import { CurrencyAmount, Token } from '$lib/types';
	import { ethersProvider } from '$lib/utils';
	import SwapCurrencySelectorButton from './SwapCurrencySelectorButton.svelte';

	export let label = '';
	export let value = '';
	export let currency: Token | null = null;
	export let onSelectCurrency = (_: Token) => {};

	let balance = '';
	$: owner = $addresses.find((a) => a.startsWith('0x'));

	let timeoutId: undefined | ReturnType<typeof setTimeout>;
	let contract: ethers.Contract | null = null;
	$: {
		if (currency) {
			contract = new ethers.Contract(currency.address, IERC20, ethersProvider);
			fetchBalance(owner);
		}
	}

	async function fetchBalance(owner?: string) {
		timeoutId = undefined;
		if (!owner || !contract || !currency) return;
		contract.balanceOf(owner).then(
			(value) => {
				balance = CurrencyAmount.fromRawAmount(
					currency as Token,
					value.toString()
				).toSignificant(6);
				timeoutId = setTimeout(() => fetchBalance(owner), 3000);
			},
			() => {}
		);
	}
</script>

<GrayCard {label} class="card-border h-[120px] w-full border border-solid">
	<div class="mt-1 flex items-center self-stretch">
		<div class="flex grow">
			<NumericalInput
				bind:value
				class="w-0 shrink grow basis-auto p-0
				text-4xl"
				on:change
				on:input
			/>
		</div>
		<SwapCurrencySelectorButton bind:currency {onSelectCurrency} />
	</div>
	{#if $account !== null}
		<span class="text-sm text-gray-400 dark:text-gray-500">Balances: {balance}</span>
	{/if}
</GrayCard>

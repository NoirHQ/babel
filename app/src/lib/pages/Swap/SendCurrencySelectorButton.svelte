<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { ethers } from 'ethers';
	import { IERC20 } from '$lib/abi';
	import { TokenLogo } from '$lib/components';
	import { ZIG } from '$lib/constants';
	import { Icons } from '$lib/flowbite';
	import {
		account,
		addresses,
		openCurrencySelector,
		onSelectCurrency as callback
	} from '$lib/store';
	import { CurrencyAmount, Token } from '$lib/types';
	import { ethersProvider } from '$lib/utils';

	export let onSelectCurrency = (selected: Token) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = undefined;
		}
		balance = '';
		currency = selected;
	};
	export let currency = ZIG;

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

	function openModal() {
		callback.set(onSelectCurrency);
		openCurrencySelector.set(true);
	}
</script>

<button
	class={twMerge(
		'flex items-center rounded-b-2xl bg-gray-100 p-0 dark:bg-gray-800',
		$$props.class
	)}
	on:click={openModal}
>
	<div class="flex w-full items-center justify-center p-4 hover:bg-gray-400 hover:bg-opacity-5">
		<TokenLogo symbol={currency.symbol} />
		<div class="flex grow flex-col pl-3 text-left">
			<span class="dark:text-white">{currency.symbol} </span>
			{#if $account !== null}
				<span class="text-sm text-gray-400 dark:text-gray-500">Balances: {balance}</span>
			{/if}
		</div>
		<Icons.AngleDownOutline class="text-gray-500" />
	</div>
</button>

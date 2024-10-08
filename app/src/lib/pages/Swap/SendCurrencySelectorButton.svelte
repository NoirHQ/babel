<script lang="ts">
	import { AngleDownOutline } from 'flowbite-svelte-icons';
	import { twMerge } from 'tailwind-merge';
	import { TokenLogo } from '$lib/components';
	import { ZIG } from '$lib/constants';
	import { openCurrencySelector, onSelectCurrency as callback } from '$lib/store';
	import { Token } from '$lib/types';

	export let onSelectCurrency = (selected: Token) => {
		currency = selected;
	};
	export let currency = ZIG;

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
		<TokenLogo symbol={currency.symbol} /><span class="grow pl-3 text-left dark:text-white"
			>{currency.symbol}
		</span>
		<AngleDownOutline class="text-gray-500" />
	</div>
</button>

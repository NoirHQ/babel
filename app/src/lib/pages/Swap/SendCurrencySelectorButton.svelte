<script lang="ts">
	import type { Currency } from '$lib/components';
	import { Button } from 'flowbite-svelte';
	import { AngleDownOutline } from 'flowbite-svelte-icons';
	import { twMerge } from 'tailwind-merge';
	import { TokenLogo } from '$lib/components';
	import { modalOpen, onSelectCurrency as callback } from './store';

	export let onSelectCurrency = (selected: Currency) => {
		currency = selected;
	};
	export let currency: Currency = {
		name: 'Ziggurat',
		symbol: 'ZIG'
	};

	function openModal() {
		callback.set(onSelectCurrency);
		modalOpen.set(true);
	}
</script>

<button
	class="flex items-center rounded-b-2xl bg-gray-100 p-0 dark:bg-gray-800"
	on:click={openModal}
>
	<div class="flex w-full items-center justify-center p-4 hover:bg-gray-400 hover:bg-opacity-5">
		<TokenLogo symbol={currency.symbol} /><span class="grow pl-3 text-left dark:text-white"
			>{currency.symbol}
		</span>
		<AngleDownOutline class="text-gray-500" />
	</div>
</button>

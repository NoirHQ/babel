<script lang="ts">
	import type { Currency } from '$lib/types';
	import { Button, Icons } from '$lib/flowbite';
	import { twMerge } from 'tailwind-merge';
	import { TokenLogo } from '$lib/components';
	import { openCurrencySelector, onSelectCurrency as callback } from '$lib/store';
	import { Token } from '$lib/types';

	export let onSelectCurrency = (selected: Token) => {
		currency = selected;
	};
	export let currency: Currency | null = null;

	$: buttonClass = twMerge(
		'text-md ml-3 gap-1 px-3 py-1.5',
		currency ? 'dark:bg-gray-900' : '',
		$$props.class
	);

	function openModal() {
		callback.set(onSelectCurrency);
		openCurrencySelector.set(true);
	}
</script>

<Button pill class={buttonClass} color={currency ? 'alternative' : 'primary'} on:click={openModal}>
	{#if currency}
		<TokenLogo size="xs" symbol={currency.symbol} />{currency.symbol}<Icons.AngleDownOutline />
	{:else}
		Select Token<Icons.AngleDownOutline />
	{/if}
</Button>

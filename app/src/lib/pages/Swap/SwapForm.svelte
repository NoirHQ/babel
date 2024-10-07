<script lang="ts">
	import type { Currency } from '$lib/components';
	import { Button } from 'flowbite-svelte';
	import { ArrowDownOutline } from 'flowbite-svelte-icons';
	import { TabItem } from '$lib/components';
	import SwapCurrencyInput from './SwapCurrencyInput.svelte';
	import { account, openAccountModal } from '$lib/store';

	export let open = false;

	let inputAmount = '';
	let inputCurrency: Currency | null = null;

	let outputAmount = '';
	let outputCurrency: Currency | null = null;

	function swapCurrencies() {
		[inputAmount, outputAmount] = [outputAmount, inputAmount];
		[inputCurrency, outputCurrency] = [outputCurrency, inputCurrency];
	}

	function onSelectInputCurrency(selected: Currency) {
		if (selected === outputCurrency) {
			swapCurrencies();
		} else {
			inputCurrency = selected;
		}
	}

	function onSelectOutputCurrency(selected: Currency) {
		if (selected === inputCurrency) {
			swapCurrencies();
		} else {
			outputCurrency = selected;
		}
	}
</script>

<TabItem {open}>
	<span slot="title">Swap</span>
	<form class="flex flex-col gap-1">
		<SwapCurrencyInput
			label="Sell"
			bind:value={inputAmount}
			bind:currency={inputCurrency}
			onSelectCurrency={onSelectInputCurrency}
		/>
		<button
			class="z-10 my-[-22px] inline-flex h-10 w-10 self-center rounded-xl
				border-4 border-white bg-gray-100 dark:border-gray-900 dark:bg-gray-800"
			on:click={swapCurrencies}
		>
			<div
				class="flex h-full w-full items-center justify-center hover:bg-gray-400 hover:bg-opacity-5"
			>
				<ArrowDownOutline class="dark:text-white" />
			</div>
		</button>
		<SwapCurrencyInput
			label="Buy"
			bind:value={outputAmount}
			bind:currency={outputCurrency}
			onSelectCurrency={onSelectOutputCurrency}
		/>
		{#if $account === null}
			<Button
				size="xl"
				class="overflow-hidden rounded-2xl bg-opacity-20 p-0 text-xl
				font-medium text-primary-600 hover:bg-opacity-20 dark:bg-opacity-20
				dark:hover:bg-opacity-20"
				on:click={() => ($openAccountModal = true)}
			>
				<div class="w-full p-4 hover:bg-gray-400 hover:bg-opacity-5">
					Connect wallet
				</div></Button
			>
		{:else if !inputAmount || !outputAmount}
			<Button
				size="xl"
				color="none"
				class="rounded-2xl bg-gray-100 text-xl
				font-medium text-gray-300 dark:bg-gray-800 dark:text-gray-600">Enter an amount</Button
			>
		{:else}
			<Button size="xl" class="rounded-2xl text-xl font-medium">Swap</Button>
		{/if}
	</form>
</TabItem>

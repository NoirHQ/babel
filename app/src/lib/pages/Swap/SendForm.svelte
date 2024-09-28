<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { GrayCard, NumericalInput, TabItem } from './common';
	import SendCurrencySelectorButton from './SendCurrencySelectorButton.svelte';
	import { account } from './store';

	export let open = false;

	let amount = '';
	let recipient = '';
	$: action = checkAmount(amount) || checkRecipient(recipient) || 'Send';

	function checkAmount(amount: string) {
		if (amount === '') {
			return 'Input amount';
		}
		return '';
	}

	function checkRecipient(recipient: string) {
		if (recipient === '') {
			return 'Input recipient';
		}
		return '';
	}
</script>

<TabItem {open}>
	<span slot="title">Send</span>
	<form class="flex flex-col gap-1">
		<GrayCard label="You're sending" class="justify-between rounded-b-none">
			<NumericalInput
				bind:value={amount}
				style="field-sizing: content;"
				class="max-w-full self-center py-14 text-7xl"
			/>
		</GrayCard>
		<SendCurrencySelectorButton />
		<GrayCard label="To" class="py-3">
			<input
				class="w-full border-none bg-transparent pl-0 pt-1.5 placeholder-gray-300
				focus:outline-none focus:ring-transparent dark:bg-transparent
				dark:text-white dark:placeholder-gray-600 dark:caret-white
				dark:focus:ring-transparent"
				placeholder="Wallet address"
				bind:value={recipient}
			/>
		</GrayCard>
		{#if $account === null}
			<Button
				size="xl"
				class="overflow-hidden rounded-2xl bg-opacity-20 p-0 text-xl
				font-medium text-primary-600 hover:bg-opacity-20 dark:bg-opacity-20
				dark:hover:bg-opacity-20"
			>
				<div class="w-full p-4 hover:bg-gray-400 hover:bg-opacity-5">Sign in</div></Button
			>
		{:else if action !== 'Send'}
			<Button
				size="xl"
				color="none"
				class="rounded-2xl bg-gray-100 text-xl
				font-medium text-gray-300 dark:bg-gray-800 dark:text-gray-600">{action}</Button
			>
		{:else}
			<Button size="xl" class="rounded-2xl text-xl font-medium">{action}</Button>
		{/if}
	</form>
</TabItem>

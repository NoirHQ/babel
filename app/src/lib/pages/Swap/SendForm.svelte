<script lang="ts">
	import SendCurrencySelectorButton from './SendCurrencySelectorButton.svelte';
	import { GrayCard, NumericalInput, TabItem } from '$lib/components';
	import { Button } from '$lib/flowbite';
	import { account, accountProvider, openAccountModal, polkadotJsApi as api } from '$lib/store';
	import { Token } from '$lib/types';
	import { parseAmount } from '$lib/utils';
	import { transfer } from './services/cosmos';
	import { sendERC20 } from './services/send';

	export let open = false;
	export let currency: Token;

	let amount = '';
	let recipient = '';
	$: action = checkAmount(amount) || checkRecipient(recipient) || 'Send';

	function checkAmount(amount: string) {
		if (amount === '') {
			return 'Input amount';
		} else if (/^[0-9]+[.]?[0-9]{0,18}$/.test(amount) === false) {
			return 'Invalid amount';
		}
		return '';
	}

	function checkRecipient(recipient: string) {
		if (recipient === '') {
			return 'Input recipient';
		}
		return '';
	}

	function send() {
		const value = parseAmount(amount);
		if ($accountProvider?.type === 'polkadot') {
			sendERC20(currency, recipient, value);
		} else if ($accountProvider?.type === 'cosmos') {
			(async () => {
				try {
					await transfer($account, recipient, value);
				} catch (e) {
					console.error(e);
				}
			})();
		} else if ($accountProvider?.type === 'ethereum') {
			sendERC20(currency, recipient, value);
		}
	}
</script>

<TabItem {open}>
	<span slot="title">Send</span>
	<form class="flex flex-col gap-1">
		<div class="flex w-full flex-col gap-px">
			<GrayCard label="You're sending" class="justify-between rounded-b-none">
				<NumericalInput
					bind:value={amount}
					style="field-sizing: content;"
					class="max-w-full self-center py-14 text-7xl"
				/>
			</GrayCard>
			<SendCurrencySelectorButton bind:currency />
		</div>
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
				on:click={() => ($openAccountModal = true)}
			>
				<div class="w-full p-4 hover:bg-gray-400 hover:bg-opacity-5">
					Connect wallet
				</div></Button
			>
		{:else if action !== 'Send'}
			<Button
				size="xl"
				color="none"
				class="rounded-2xl bg-gray-100 text-xl
				font-medium text-gray-300 dark:bg-gray-800 dark:text-gray-600">{action}</Button
			>
		{:else}
			<Button size="xl" class="rounded-2xl text-xl font-medium" on:click={send}
				>{action}</Button
			>
		{/if}
	</form>
</TabItem>

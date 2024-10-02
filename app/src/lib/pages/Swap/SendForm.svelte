<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { GrayCard, NumericalInput, TabItem } from '$lib/components';
	import SendCurrencySelectorButton from './SendCurrencySelectorButton.svelte';
	import { account, accountProvider, openAccountModal, polkadotJsApi as api } from '$lib/store';
	import { bech32 } from '@scure/base';
	import { ethers } from 'ethers';
	import babel from '$lib/babel.json';

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

	function send() {
		// XXX: Should handle flaoting point numbers in a safer way.
		const value = '0x' + (BigInt(amount) * BigInt(1e18)).toString(16);
		if ($accountProvider?.type === 'polkadot') {
			if ($api === null) {
				return;
			}
			let to;
			if (recipient.startsWith('0x')) {
				to = { Ethereum: recipient };
			} else if (recipient.startsWith('cosmos1')) {
				to = { Cosmos: bech32.fromWords(bech32.decode(recipient).words) };
			} else {
				to = { Polkadot: recipient };
			}
			$api?.tx.babel.transfer(to, value).signAndSend($account, {
				signer: $accountProvider.provider.signer
			});
		} else if ($accountProvider?.type === 'cosmos') {
		} else if ($accountProvider?.type === 'ethereum') {
			if (recipient.startsWith('0x')) {
				$accountProvider.provider.request({
					method: 'eth_sendTransaction',
					params: [
						{
							from: $account,
							to: recipient,
							value
						}
					]
				});
			} else {
				if ($api === null) {
					return;
				}
				let to;
				if (recipient.startsWith('cosmos1')) {
					to = { Cosmos: bech32.fromWords(bech32.decode(recipient).words) };
				} else {
					to = { Polkadot: recipient };
				}
				const call = $api?.tx.babel.transfer(to, value).inner.toHex();
				new ethers.BrowserProvider($accountProvider.provider).getSigner().then((signer) => {
					const babelContract = new ethers.Contract(
						'0x0000000000000000000000000000000000000400',
						babel,
						signer
					);
					// XXX: eth_call should return an actual gas fee.
					babelContract.dispatch(call, { gasLimit: 100_000 });
				});
			}
		}
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
		<SendCurrencySelectorButton class="mt-[-3px]" />
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
			<Button size="xl" class="rounded-2xl text-xl font-medium" on:click={send}
				>{action}</Button
			>
		{/if}
	</form>
</TabItem>

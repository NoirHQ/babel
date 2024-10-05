<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { GrayCard, NumericalInput, TabItem } from '$lib/components';
	import SendCurrencySelectorButton from './SendCurrencySelectorButton.svelte';
	import { account, accountProvider, openAccountModal, polkadotJsApi as api } from '$lib/store';
	import { bech32 } from '@scure/base';
	import { ethers } from 'ethers';
	import babel from '$lib/babel.json';
	import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
	import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
	import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
	import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
	import { Buffer } from 'buffer';

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
			(async () => {
				try {
					const chainId = 'ziggurat-1';
					const offlineSigner = $accountProvider.provider.getOfflineSigner(chainId);
					const client = await SigningCosmWasmClient.offline(offlineSigner);
					const {
						account: { sequence }
					} = await (
						await fetch(
							`http://localhost:1317/cosmos/auth/v1beta1/accounts/${$account}`
						)
					).json();
					const signerData = {
						accountNumber: 0,
						sequence: parseInt(sequence),
						chainId
					};

					if (recipient.startsWith('cosmos1')) {
						const sendMsg = {
							typeUrl: MsgSend.typeUrl,
							value: {
								fromAddress: $account,
								toAddress: recipient,
								amount: [{ denom: 'azig', amount: BigInt(value).toString() }]
							}
						};
						const fee = {
							amount: [
								{
									denom: 'azig',
									amount: '320000000'
								}
							],
							gas: '320000000'
						};

						const txRaw = await client.sign($account!, [sendMsg], fee, '', signerData);
						const txBytes = TxRaw.encode(txRaw).finish();
						const hash = await $accountProvider.provider.sendTx(
							chainId,
							txBytes,
							'sync'
						);

						console.log(`hash: 0x${Buffer.from(hash).toString('hex')}`);
					} else {
						if ($api === null) {
							return;
						}
						let to;
						if (recipient.startsWith('0x')) {
							to = { Ethereum: recipient };
						} else {
							to = { Polkadot: recipient };
						}
						const contract =
							'cosmos1d4hkgmryd9ehqct5vd5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqel3ghf';
						let call = $api?.tx.babel.transfer(to, value).inner.toHex();
						call = Buffer.from(
							call.startsWith('0x') ? call.slice(2) : call,
							'hex'
						).toString('base64');

						const executeMsg = {
							typeUrl: MsgExecuteContract.typeUrl,
							value: {
								sender: $account,
								contract,
								msg: Buffer.from(
									JSON.stringify({
										dispatch: {
											input: call
										}
									}),
									'utf8'
								),
								funds: []
							}
						};

						const fee = {
							amount: [
								{
									denom: 'azig',
									amount: '360000000'
								}
							],
							gas: '360000000'
						};

						const txRaw = await client.sign(
							$account!,
							[executeMsg],
							fee,
							'',
							signerData
						);
						const txBytes = TxRaw.encode(txRaw).finish();
						const hash = await $accountProvider.provider.sendTx(
							chainId,
							txBytes,
							'sync'
						);

						console.log(`hash: 0x${Buffer.from(hash).toString('hex')}`);
					}
				} catch (e) {
					console.error(e);
				}
			})();
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
				class="text-primary-600 overflow-hidden rounded-2xl bg-opacity-20 p-0
				text-xl font-medium hover:bg-opacity-20 dark:bg-opacity-20
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

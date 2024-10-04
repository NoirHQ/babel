<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { GrayCard, NumericalInput, TabItem } from '$lib/components';
	import SendCurrencySelectorButton from './SendCurrencySelectorButton.svelte';
	import { account, accountProvider, openAccountModal, polkadotJsApi as api } from '$lib/store';
	import { bech32 } from '@scure/base';
	import { ethers } from 'ethers';
	import babel from '$lib/babel.json';
	import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
	import { Tx, TxBody, AuthInfo, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
	import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
	import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
	import Long from 'long';
	import { type BroadcastMode } from '@keplr-wallet/types';

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
			if (recipient.startsWith('cosmos1')) {
				(async () => {
					const chainId = 'ziggurat-1';
					const msg = MsgSend.fromPartial({
						fromAddress: $account,
						toAddress: recipient,
						amount: [
							{
								denom: 'azig',
								amount: BigInt(value).toString()
							}
						]
					});
					const body = TxBody.fromPartial({
						messages: [
							{
								typeUrl: MsgSend.typeUrl,
								value: MsgSend.encode(msg).finish()
							}
						]
					});

					const offlineSigner = $accountProvider.provider.getOfflineSigner(chainId);
					const accounts = await offlineSigner.getAccounts();
					const response = await (
						await fetch(
							`http://localhost:1317/cosmos/auth/v1beta1/accounts/${$account}`
						)
					).json();
					const { sequence } = response.account;
					const signerInfos = [
						{
							publicKey: {
								typeUrl: PubKey.typeUrl,
								value: PubKey.fromPartial({ key: accounts[0].pubkey })
							},
							modeInfo: {
								single: {
									mode: SignMode.SIGN_MODE_DIRECT
								}
							},
							sequence: BigInt(sequence)
						}
					];
					const fee = {
						amount: [
							{
								denom: 'azig',
								amount: '320000000'
							}
						],
						gas: '320000000'
					};
					const authInfo = AuthInfo.fromPartial({
						signerInfos,
						fee
					});

					const tx = Tx.fromPartial({
						body,
						authInfo
					});
					const txBytes = Tx.encode(tx).finish();
					const txRaw = TxRaw.decode(txBytes);

					const { signatures } = await $accountProvider.provider.signDirect(
						chainId,
						$account,
						{
							bodyBytes: txRaw.bodyBytes,
							authInfoBytes: txRaw.authInfoBytes,
							chainId,
							accountNumber: Long.fromNumber(0)
						}
					);

					tx.signatures = signatures;

					const result = await $accountProvider.provider.snedTx(
						chainId,
						Tx.encode(tx).finish(),
						BroadcastMode.Sync
					);

					console.log(result);
				})();
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
				const call = $api?.tx.babel.transfer(to, value).inner.toHex();
			}
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

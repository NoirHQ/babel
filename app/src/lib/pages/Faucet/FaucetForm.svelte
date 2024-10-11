<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { GrayCard, TokenLogo } from '$lib/components';
	import { account } from '$lib/store';
	import CaptchaV2 from './CaptchaV2.svelte';
	import { PUBLIC_CAPTCHA_KEY } from '$env/static/public';
	import { faucetRequest } from './service';
	import Success from './Success.svelte';
	import Error from './Error.svelte';
	import { ethers } from 'ethers';
	import { bech32 } from '@scure/base';
	import { decodeAddress } from '@polkadot/util-crypto';

	let assetId = -1;
	let address = $account ?? '';
	let token = '';

	let fetchResult = '';
	let error = '';

	$: action = checkAddress(address) || checkToken(token) || 'Get some ZIGs';

	function checkToken(token: string) {
		if (token === '') {
			return 'Complete reCAPCHA';
		}
		return '';
	}

	function validateAddress(address: string): boolean {
		try {
			if (address.startsWith('0x')) {
				ethers.getAddress(address);
			} else if (address.startsWith('cosmos1')) {
				bech32.decode(address);
			} else {
				decodeAddress(address);
			}
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	function checkAddress(address: string) {
		if (address === '') {
			return 'Input address';
		} else if (!validateAddress(address)) {
			return 'Invalid address';
		}
		return '';
	}

	function onToken(tokenEvent: CustomEvent<string>) {
		token = tokenEvent.detail;
	}

	async function onSubmit() {
		try {
			await faucetRequest(address, token, assetId);
			fetchResult = 'success';
		} catch (e: any) {
			fetchResult = 'error';
			error = e.toString();
		}
	}
</script>

<div>
	{#if fetchResult === 'success'}
		<Success />
	{:else if fetchResult === 'error'}
		<Error {error} />
	{:else}
		<form class="flex flex-col gap-px px-2" on:submit|preventDefault={onSubmit}>
			<GrayCard label="You'll receive" class="justify-between rounded-b-none">
				<span
					style="field-sizing: content;"
					class="max-w-full self-center py-14 text-7xl dark:text-white">1</span
				>
			</GrayCard>
			<GrayCard class="flex items-center rounded-t-none p-0">
				<div
					class="flex w-full items-center justify-center p-4 hover:bg-gray-400 hover:bg-opacity-5"
				>
					<TokenLogo symbol="ZIG" /><span class="grow pl-3 text-left dark:text-white"
						>ZIG
					</span>
				</div>
			</GrayCard>
			<GrayCard label="To" class="mt-[3px] py-3">
				<input
					class="w-full border-none bg-transparent pl-0 pt-1.5 placeholder-gray-300
				focus:outline-none focus:ring-transparent dark:bg-transparent
				dark:text-white dark:placeholder-gray-600 dark:caret-white
				dark:focus:ring-transparent"
					placeholder="Wallet address"
					bind:value={address}
				/>
			</GrayCard>
			<div class="mb-1.5 mt-2 flex w-full flex-col items-center">
				<CaptchaV2 captchaKey={PUBLIC_CAPTCHA_KEY ?? ''} on:token={onToken} />
			</div>
			{#if action !== 'Get some ZIGs'}
				<Button
					size="xl"
					color="none"
					class="rounded-2xl bg-gray-100 text-xl font-medium text-gray-300 dark:bg-gray-800 dark:text-gray-600"
					>{action}</Button
				>
			{:else}
				<Button type="submit" size="xl" class="rounded-2xl text-xl font-medium"
					>{action}</Button
				>
			{/if}
		</form>
	{/if}
</div>

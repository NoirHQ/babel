<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { GrayCard } from '$lib/components';
	import CaptchaV2 from './CaptchaV2.svelte';
	import { PUBLIC_CAPTCHA_KEY } from '$env/static/public';
	import { faucetRequest } from './service';
	import Success from './Success.svelte';
	import Error from './Error.svelte';

	let assetId = -1;
	let address = '';
	let token = '';

	let fetchResult = '';
	let error = '';

	$: action = checkAddress(address) || checkToken(token) || 'Get some Zigs';

	function checkToken(token: string) {
		if (token === '') {
			return 'Complete reCAPCHA';
		}
		return '';
	}

	function checkAddress(address: string) {
		if (address === '') {
			return 'Input address';
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
		<form class="flex flex-col gap-1" on:submit|preventDefault={onSubmit}>
			<GrayCard label="You will receive" class="justify-between">
				<span
					style="field-sizing: content;"
					class="max-w-full self-center py-14 text-7xl dark:text-white">1 Zig</span
				>
			</GrayCard>
			<GrayCard label="Address" class="py-3">
				<input
					class="w-full border-none bg-transparent pl-0 pt-1.5 placeholder-gray-300
				focus:outline-none focus:ring-transparent dark:bg-transparent
				dark:text-white dark:placeholder-gray-600 dark:caret-white
				dark:focus:ring-transparent"
					placeholder="Wallet address"
					bind:value={address}
				/>
			</GrayCard>
			<div class="mb-1.5 mt-2 flex w-full justify-center">
				<CaptchaV2
					captchaKey={PUBLIC_CAPTCHA_KEY ?? ''}
					on:token={onToken}
					theme={'dark'}
				/>
			</div>
			{#if action !== 'Get some Zigs'}
				<Button
					size="xl"
					color="none"
					class="rounded-2xl bg-gray-100 text-xl
		font-medium text-gray-300 dark:bg-gray-800 dark:text-gray-600">{action}</Button
				>
			{:else}
				<Button type="submit" size="xl" class="rounded-2xl text-xl font-medium"
					>{action}</Button
				>
			{/if}
		</form>
	{/if}
</div>

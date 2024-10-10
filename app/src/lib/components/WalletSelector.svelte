<script lang="ts">
	import { onMount } from 'svelte';
	import { Avatar } from 'flowbite-svelte';
	import { ethers } from 'ethers';
	import { PUBLIC_COSMOS_CHAIN_ID } from '$env/static/public';
	import { WalletLogo } from '$lib/components';
	import { Ethereum } from '$lib/constants';
	import { account, accountProvider } from '$lib/store';
	import { setEthersProvider } from '$lib/utils';

	export let open = false;

	let wallets = {
		polkadot: [],
		cosmos: [],
		ethereum: []
	};

	let addresses = [];

	function onAnnouncement(event) {
		wallets.ethereum.push({
			name: event.detail.info.name,
			icon: event.detail.info.icon,
			provider: event.detail.provider
		});
	}

	function onEthereumAccountsChanged(accounts) {
		if (accounts.length > 0) {
			account.set(accounts[0]);
		} else {
			account.set(null);
			$accountProvider?.provider.removeListener('accountsChanged', onEthereumAccountsChanged);
		}
	}

	function detectPolakadotWallet(id: string, name: string) {
		if (window.injectedWeb3.hasOwnProperty(id)) {
			wallets.polkadot.push({
				name,
				provider: window.injectedWeb3[id]
			});
		}
	}

	async function enablePolkadot(provider) {
		const extension = await provider.enable();
		accountProvider.set({
			type: 'polkadot',
			provider: extension
		});
		const accounts = await extension.accounts.get();
		if (accounts.length > 0) {
			account.set(accounts[0].address);
		}
	}

	async function enableCosmos(provider) {
		await window.keplr.enable(PUBLIC_COSMOS_CHAIN_ID);
		accountProvider.set({
			type: 'cosmos',
			provider
		});
		const offlineSigner = window.keplr.getOfflineSigner(PUBLIC_COSMOS_CHAIN_ID);
		const accounts = await offlineSigner.getAccounts();
		if (accounts.length > 0) {
			account.set(accounts[0].address);
		}
	}

	async function enableEthereum(provider) {
		accountProvider.set({
			type: 'ethereum',
			provider
		});
		setEthersProvider(new ethers.BrowserProvider(provider));
		const accounts = await provider.request({ method: 'eth_requestAccounts' });
		if (accounts.length > 0) {
			account.set(ethers.getAddress(accounts[0]));
		}
		provider.on('accountsChanged', onEthereumAccountsChanged);

		try {
			await provider // Or window.ethereum if you don't support EIP-6963.
				.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: Ethereum.chainId }]
				});
		} catch (switchError) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (switchError.code === 4902) {
				try {
					await provider // Or window.ethereum if you don't support EIP-6963.
						.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: Ethereum.chainId,
									chainName: 'Ziggurat',
									rpcUrls: [Ethereum.endpoint],
									nativeCurrency: {
										decimals: 18,
										name: 'Ziggurat',
										symbol: 'ZIG'
									}
								}
							]
						});
				} catch (addError) {
					// Handle "add" error.
				}
			}
			// Handle other "switch" errors.
		}
	}

	onMount(() => {
		window.addEventListener('eip6963:announceProvider', onAnnouncement);
		window.dispatchEvent(new Event('eip6963:requestProvider'));

		if (window.injectedWeb3) {
			let knownWallets = [
				['subwallet-js', 'SubWallet'],
				['talisman', 'Talisman'],
				['polkadot-js', 'Polkadot{.js}']
			];
			knownWallets.forEach((s) => detectPolakadotWallet(...s));
		}

		if (window.keplr) {
			wallets.cosmos.push({
				name: 'Keplr',
				provider: window.keplr
			});
		}

		wallets = wallets;

		return () => {
			window.removeEventListener('eip6963:announceProvider', onAnnouncement);
		};
	});
</script>

{#if wallets.polkadot.length > 0}
	<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Polkadot</span>
{/if}
<div class="flex flex-col items-stretch gap-px px-4">
	{#each wallets.polkadot as wallet}
		<button
			class="bg-gray-100 px-4 py-3 first:rounded-t-xl last:rounded-b-xl
			only:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
			on:click={() => {
				enablePolkadot(wallet.provider);
				open = false;
			}}
		>
			<div class="flex items-center gap-3">
				<WalletLogo name={wallet.name} />
				<span class="font-medium">{wallet.name}</span>
				<span class="grow text-right text-xs">Detected</span>
			</div>
		</button>
	{/each}
</div>
{#if wallets.cosmos.length > 0}
	<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white">Cosmos</span>
{/if}
<div class="flex flex-col items-stretch gap-px px-4">
	{#each wallets.cosmos as wallet}
		<button
			class="bg-gray-100 px-4 py-3 first:rounded-t-xl last:rounded-b-xl
			only:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
			on:click={() => {
				enableCosmos(wallet.provider);
				open = false;
			}}
		>
			<div class="flex items-center gap-3">
				<WalletLogo name={wallet.name} />
				<span class="font-medium">{wallet.name}</span>
				<span class="grow text-right text-xs">Detected</span>
			</div>
		</button>
	{/each}
</div>
{#if wallets.ethereum.length > 0}
	<span class="px-6 pb-2 pt-4 text-sm font-semibold text-black dark:text-white"
		>Ethereum (EIP-6963)</span
	>
{/if}
<div class="flex flex-col items-stretch gap-px px-4">
	{#each wallets.ethereum as wallet}
		<button
			class="h-16 bg-gray-100 px-4 py-3 first:rounded-t-xl
			last:rounded-b-xl only:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
			on:click={() => {
				enableEthereum(wallet.provider);
				open = false;
			}}
		>
			<div class="flex items-center gap-3">
				<WalletLogo name={wallet.name} src={wallet.icon} variant="ethereum" />
				<span class="font-medium">{wallet.name}</span>
				<span class="grow text-right text-xs">Detected</span>
			</div>
		</button>
	{/each}
</div>

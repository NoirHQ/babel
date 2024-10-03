<script lang="ts">
	import { onMount } from 'svelte';
	import { Avatar } from 'flowbite-svelte';
	import { account, accountProvider } from '$lib/store';
	import { PUBLIC_COSMOS_CHAIN_ID } from '$env/static/public';

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
		const accounts = await provider.request({ method: 'eth_requestAccounts' });
		if (accounts.length > 0) {
			account.set(accounts[0]);
		}
		provider.on('accountsChanged', onEthereumAccountsChanged);

		try {
			await provider // Or window.ethereum if you don't support EIP-6963.
				.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x539' }]
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
									chainId: '0x539',
									chainName: 'Ziggurat',
									rpcUrls: ['http://localhost:8545'],
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
	<span class="bg-gray-100 p-3 text-sm font-semibold text-black dark:bg-gray-800 dark:text-white"
		>Polkadot</span
	>
{/if}
{#each wallets.polkadot as wallet}
	<button
		class="px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-500"
		on:click={() => {
			enablePolkadot(wallet.provider);
			open = false;
		}}
	>
		<div class="flex items-center gap-3">
			<Avatar>{Array.from(wallet.name)[0]}</Avatar>
			<span class="font-medium">{wallet.name}</span>
		</div>
	</button>
{/each}
{#if wallets.cosmos.length > 0}
	<span class="bg-gray-100 p-3 text-sm font-semibold text-black dark:bg-gray-800 dark:text-white"
		>Cosmos</span
	>
{/if}
{#each wallets.cosmos as wallet}
	<button
		class="px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-500"
		on:click={() => {
			enableCosmos(wallet.provider);
			open = false;
		}}
	>
		<div class="flex items-center gap-3">
			<Avatar>{Array.from(wallet.name)[0]}</Avatar>
			<span class="font-medium">{wallet.name}</span>
		</div>
	</button>
{/each}
{#if wallets.ethereum.length > 0}
	<span class="bg-gray-100 p-3 text-sm font-semibold text-black dark:bg-gray-800 dark:text-white"
		>Ethereum (EIP-6963)</span
	>
{/if}
{#each wallets.ethereum as wallet}
	<button
		class="px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-500"
		on:click={() => {
			enableEthereum(wallet.provider);
			open = false;
		}}
	>
		<div class="flex items-center gap-3">
			<img class="h-8 w-8" src={wallet.icon} alt={wallet.name} />
			<span class="font-medium">{wallet.name}</span>
		</div>
	</button>
{/each}

<script lang="ts">
	import ChainCard from '$lib/components/ChainCard.svelte';
	import { suggestChain } from './services/keplr';
	import { addEthereumChain } from './services/metamask';
</script>

<div class="flex w-full flex-col items-center gap-4">
	<span class="text-2xl font-bold dark:text-white">Add Ziggurat to your wallets</span>
	<div class="text-gray-500 dark:text-gray-400">
		You can add Ziggurat to the list of networks in your wallets.
	</div>
	<div class="mt-10 w-full">
		<div class="flex w-full flex-row px-2 md:px-6">
			<p class="flex-1 text-xs text-gray-500 dark:text-gray-400">WALLET NAME</p>
			<p class="flex-1 text-xs text-gray-500 dark:text-gray-400">CHAIN INFO</p>
			<p class="flex-1 text-xs text-gray-500 dark:text-gray-400">ADD NETWORK</p>
		</div>
		<ChainCard
			image={'/images/keplr.png'}
			walletName={'Keplr'}
			chainName={'Ziggurat'}
			denom={'ZIG'}
			onclick={suggestChain}
		/>
		<ChainCard
			image={'/images/metamask.png'}
			walletName={'MetaMask'}
			chainName={'Ziggurat'}
			denom={'ZIG'}
			onclick={addEthereumChain}
		/>
	</div>
</div>

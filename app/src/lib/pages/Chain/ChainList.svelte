<script lang="ts">
	import ChainCard from '$lib/components/ChainCard.svelte';
	import { suggestChain } from './services/keplr';
	import { addEthereumChain } from './services/metamask';
</script>

<div class="w-full">
	<div class="flex w-full flex-row px-2">
		<p class="flex-1 text-xs text-gray-500 dark:text-gray-400">WALLET NAME</p>
		<p class="flex-1 text-xs text-gray-500 dark:text-gray-400">CHAIN INFO</p>
		<p class="flex-1 text-xs text-gray-500 dark:text-gray-400">ADD WALLET</p>
	</div>
	<ChainCard
		image={'/keplr.png'}
		walletName={'Keplr'}
		chainName={'Ziggurat'}
		denom={'ZIG'}
		onclick={suggestChain}
	/>
	<ChainCard
		image={'/metamask.png'}
		walletName={'MetaMask'}
		chainName={'Ziggurat'}
		denom={'ZIG'}
		onclick={addEthereumChain}
	/>
</div>

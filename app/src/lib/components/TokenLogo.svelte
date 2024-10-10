<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let symbol = 'ZIG';
	export let size = 'md';

	export let classIcon = '';
	export let classLabel = '';
	$: divClass = twMerge(
		containerSizes[size],
		'overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center',
		$$props.class
	);

	const sizes: Record<string, string> = {
		xs: 'w-3 h-3',
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6',
		xl: 'w-8 h-8'
	};

	const containerSizes: Record<string, string> = {
		xs: 'w-6 h-6',
		sm: 'w-8 h-8',
		md: 'w-10 h-10',
		lg: 'w-12 h-12',
		xl: 'w-16 h-16'
	};

	const tokens: Record<string, { icon: string; name: string }> = {
		DOT: {
			icon: '/images/polkadot-logo.png',
			name: 'Polkadot'
		},
		ETH: {
			icon: '/images/ethereum-eth.svg',
			name: 'Ethereum'
		},
		ATOM: {
			icon: '/images/cosmos-atom-logo.png',
			name: 'Cosmos'
		}
	};

	const tokensWithoutBg: Record<string, { icon: string; name: string }> = {
		ZIG: {
			icon: '/images/ziggurat.svg',
			name: 'Ziggurat'
		},
		RAT: {
			icon: '/images/rat.svg',
			name: 'RatCoin'
		}
	};
</script>

{#if tokens.hasOwnProperty(symbol)}
	<img
		class={twMerge(containerSizes[size], classIcon)}
		src={tokens[symbol].icon}
		alt={`${tokens[symbol].name} Logo`}
	/>
{:else if tokensWithoutBg.hasOwnProperty(symbol)}
	<div class={divClass}>
		<img
			class={twMerge(sizes[size], 'dark:invert', classIcon)}
			src={tokensWithoutBg[symbol].icon}
			alt={`${tokensWithoutBg[symbol].name} Logo`}
		/>
	</div>
{:else}
	<div class={divClass}>
		<span class={twMerge(`text-${size}`, classLabel)}
			>{size === 'xs' ? Array.from(symbol)[0] : symbol}</span
		>
	</div>
{/if}

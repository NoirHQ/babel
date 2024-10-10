<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let name = '';
	export let src = '';
	export let size = 'md';
	export let classIcon = '';
	export let variant = '';

	const sizes: Record<string, string> = {
		xs: 'w-6 h-6',
		sm: 'w-8 h-8',
		md: 'w-10 h-10',
		lg: 'w-20 h-20',
		xl: 'w-36 h-36',
		none: ''
	};

	let icons: Record<string, string> = {
		SubWallet: '/images/subwallet.png',
		Talisman: '/images/talisman.png',
		'Polkadot{.js}': '/images/polkadot-js.png',
		Keplr: '/images/keplr.png',
		MetaMask: '/images/metamask.png'
	};

	$: containerClass = twMerge('relative', sizes[size]);
	$: divClass = twMerge(
		'w-full h-full rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden',
		$$props.class
	);
	$: iconClass = twMerge(sizes[size], classIcon);
	// TODO: Need to adjust size corresponding to the total size
	$: variantClass = twMerge('absolute bottom-0 right-0', 'w-4 h-4');
</script>

<div class={containerClass}>
	<div class={divClass}>
		{#if src !== ''}
			<img {src} alt={`${name} Logo`} class={iconClass} />
		{:else if icons.hasOwnProperty(name)}
			<img src={icons[name]} alt={`${name} Logo`} class={iconClass} />
		{:else}
			<span class={`text-${size}`}>{name.length >= 2 ? name.slice(0, 2) : name}</span>
		{/if}
	</div>
	{#if variant === 'ethereum'}
		<img src="/images/ethereum-eth.svg" alt="Ethereum-flavoured wallet" class={variantClass} />
	{/if}
</div>

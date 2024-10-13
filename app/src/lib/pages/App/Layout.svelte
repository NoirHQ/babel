<script lang="ts">
	import { PolkadotJsProvider } from '$lib/components';
	import { Toast } from '$lib/flowbite';
	import { toast } from '$lib/store';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<PolkadotJsProvider>
	<div class="relative h-dvh dark:bg-gray-900">
		<Header />
		<div class="flex h-full flex-col items-center overflow-scroll md:h-[calc(100%-72px)]">
			<slot />
		</div>
		{#if innerWidth >= 640}
			<Footer />
		{/if}
		<Toast
			class="absolute left-0 right-0 top-0 z-50 m-auto mt-3 rounded-md"
			bind:dismissable={$toast.dismissable}
			bind:toastStatus={$toast.status}>{$toast.message}</Toast
		>
	</div>
</PolkadotJsProvider>

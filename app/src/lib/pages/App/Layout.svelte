<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { PolkadotJsProvider } from '$lib/components';
	import { toast } from '$lib/store';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
</script>

<PolkadotJsProvider>
	<div class="relative h-dvh dark:bg-gray-900">
		<Header />
		<div class="flex h-[calc(100%-72px)] flex-col items-center overflow-scroll">
			<slot />
		</div>
		<Footer />
		<Toast
			class="absolute left-0 right-0 top-0 z-50 m-auto mt-3 rounded-md"
			bind:toastStatus={$toast.status}
			dismissable={false}>{$toast.message}</Toast
		>
	</div>
</PolkadotJsProvider>

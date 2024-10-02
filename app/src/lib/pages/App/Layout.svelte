<script lang="ts">
	import { PolkadotJsProvider } from '$lib/components';
	import Header from './Header.svelte';
</script>

<PolkadotJsProvider>
	<div class="relative h-dvh dark:bg-gray-900">
		<Header />
		<div class="flex h-full flex-col items-center overflow-scroll px-2.5 md:px-0">
			<slot />
		</div>
	</div>
</PolkadotJsProvider>

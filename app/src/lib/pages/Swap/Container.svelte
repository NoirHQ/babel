<script lang="ts">
	import { Tabs } from 'flowbite-svelte';
	import SendForm from './SendForm.svelte';
	import SwapForm from './SwapForm.svelte';
	import { CurrencySearchModal } from '$lib/components';
	import { modalOpen, onSelectCurrency } from './store';
</script>

<div class="mt-16 w-full max-w-[480px] pt-6 md:pt-[68px]">
	<Tabs
		tabStyle="pill"
		defaultClass="flex flex-wrap space-x-2 rtl:space-x-reverse mb-3 px-2"
		contentClass="p-0 px-2"
	>
		<SendForm open />
		<SwapForm />
	</Tabs>
</div>
<CurrencySearchModal bind:open={$modalOpen} bind:onSelectCurrency={$onSelectCurrency} />

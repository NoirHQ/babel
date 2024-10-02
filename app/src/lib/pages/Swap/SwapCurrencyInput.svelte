<script lang="ts">
	import type { Currency } from '$lib/components';
	import { GrayCard, NumericalInput } from '$lib/components';
	import SwapCurrencySelectorButton from './SwapCurrencySelectorButton.svelte';

	export let label = '';
	export let value = '';
	export let currency: Currency | null = null;
	export let onSelectCurrency = (_: Currency) => {};
</script>

<GrayCard {label} class="card-border h-[120px] w-full border border-solid">
	<div class="mt-1 flex items-center self-stretch">
		<div class="flex grow">
			<NumericalInput
				bind:value
				class="w-0 shrink grow basis-auto p-0
				text-4xl"
			/>
		</div>
		<SwapCurrencySelectorButton bind:currency {onSelectCurrency} />
	</div>
</GrayCard>

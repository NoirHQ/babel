<script>
	export let image = '';
	export let walletName = '';
	export let chainName = '';
	export let denom = '';
	export let onclick;
</script>

<div class="my-1 flex w-full flex-row items-start rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
	<div class="flex flex-1 flex-row">
		<img src={image} class="my-auto h-10 w-10" alt={image} />
		<p class="my-auto pl-4 text-lg font-medium dark:text-white">{walletName}</p>
	</div>
	<div class="flex flex-1 flex-col">
		<p class="text-md flex-1dark:text-white my-auto">{denom}</p>
		<p class="my-auto flex-1 text-sm text-gray-500 dark:text-gray-400">{chainName}</p>
	</div>
	<button
		class="my-auto flex-1 cursor-pointer text-left text-blue-600 hover:opacity-80 dark:text-blue-400"
		on:click={onclick}
	>
		{'Add to Wallet >'}
	</button>
</div>

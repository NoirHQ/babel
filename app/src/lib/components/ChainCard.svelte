<script>
	export let image = '';
	export let walletName = '';
	export let chainName = '';
	export let denom = '';
	export let onclick;
</script>

<div
	class="my-2 flex grid w-full grid-cols-4 items-start rounded-xl bg-gray-100 p-3 md:px-6 md:py-4 dark:bg-gray-800"
>
	<div class="col-span-2 my-auto flex flex-row">
		<img src={image} class="my-auto h-8 w-8" alt={image} />
		<p class="text-md my-auto pl-2 font-medium dark:text-white">{walletName}</p>
	</div>
	<div class="flex flex-col">
		<p class="my-auto flex-1 text-sm dark:text-white">{denom}</p>
		<p class="my-auto flex-1 text-xs text-gray-500 dark:text-gray-400">{chainName}</p>
	</div>
	<button
		class="my-auto cursor-pointer text-left text-sm text-blue-600 hover:opacity-80 dark:text-blue-400"
		on:click={onclick}
	>
		{'Add to Wallet >'}
	</button>
</div>

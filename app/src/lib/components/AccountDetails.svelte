<script lang="ts">
	import { account } from '$lib/store';

	export let open = false;
</script>

<span class="bg-gray-100 p-3 text-sm font-semibold text-black dark:bg-gray-800 dark:text-white"
	>Account</span
>
<button
	class="px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-500"
	on:click={() => {
		if ($account !== null) {
			navigator.clipboard.writeText($account);
		}
	}}
>
	<div class="flex items-center gap-3">
		<span class="overflow-hidden text-ellipsis text-sm">{$account}</span>
	</div>
</button>
<span class="bg-gray-100 p-3 text-sm font-semibold text-black dark:bg-gray-800 dark:text-white"
	>Mapped Addresses</span
>

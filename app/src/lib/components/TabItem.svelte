<script lang="ts">
	import { TabItem } from '$lib/flowbite';

	export let open = false;

	let activeClasses =
		'py-2 px-4 font-normal text-md text-gray-800 dark:text-white dark:bg-white bg-gray-800 hover:opacity-60 bg-opacity-5 dark:bg-opacity-5 rounded-full';
	let inactiveClasses =
		'py-2 px-4 font-normal text-md text-gray-500 rounded-full hover:opacity-60';
</script>

<TabItem {activeClasses} {inactiveClasses} {...$$restProps} bind:open>
	<slot name="title" slot="title" />
	<slot />
</TabItem>

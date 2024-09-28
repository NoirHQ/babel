<script lang="ts">
	import Header from './Header.svelte';
</script>

<div class="relative h-dvh dark:bg-gray-900">
	<Header />
	<div class="flex h-full flex-col items-center overflow-scroll px-2.5 md:px-0">
		<slot />
	</div>
</div>

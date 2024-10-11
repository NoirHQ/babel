<script lang="ts">
	import { Button, P } from 'flowbite-svelte';
	import ErrorCircle from './icons/ErrorCircle.svelte';

	export let error: string | undefined;

	function onGoBack() {
		window.location.reload();
	}
</script>

<div class="w-full px-2">
	<div class="icon">
		<ErrorCircle />
	</div>
	<P size="xl" align="center" class="my-2 dark:text-white"
		>{error ?? 'There was an error during the transaction.'}</P
	>
	<Button size="xl" class="w-full rounded-2xl text-xl font-medium" on:click={onGoBack}
		>Go back</Button
	>
</div>

<style lang="postcss">
	.icon {
		@apply grid w-full place-items-center;
		color: #f87272;
	}
</style>

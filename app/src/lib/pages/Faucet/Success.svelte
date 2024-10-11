<script lang="ts">
	import { Button, P } from 'flowbite-svelte';
	import CheckCircle from './icons/CheckCircle.svelte';

	function onGoBack() {
		window.location.reload();
	}
</script>

<div class="w-full px-2">
	<div class="icon">
		<CheckCircle />
	</div>
	<P size="xl" align="center" class="my-2 dark:text-white"
		>Successfully sent Zigs to your address.</P
	>
	<Button size="xl" class="w-full rounded-2xl text-xl font-medium" on:click={onGoBack}
		>Go back</Button
	>
</div>

<style lang="postcss">
	.icon {
		@apply grid w-full place-items-center;
		color: #51e591;
	}
</style>

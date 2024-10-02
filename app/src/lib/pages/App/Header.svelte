<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		Avatar,
		Button,
		DarkMode,
		Modal,
		Navbar,
		NavBrand,
		NavLi,
		NavUl
	} from 'flowbite-svelte';
	import { BarsOutline } from 'flowbite-svelte-icons';
	import { AccountModal, Logo } from '$lib/components';
	import { account, openAccountModal } from '$lib/store';

	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';

	let open = false;

	let routes = [
		{ url: '/', text: 'Trade' },
		{ url: '#', text: 'Pool🚧' },
		{ url: '/faucet', text: 'Faucet' }
	];
</script>

<Navbar
	class="fixed start-0 top-0 z-20 mx-0 w-full border-b border-none px-3 py-2 sm:px-4 md:py-1.5
	dark:bg-gray-900"
	fluid={true}
>
	<NavBrand href="/" class="p-2 text-2xl">
		<Logo class="fill-black dark:fill-white" />
		<Button
			color="alternative"
			class="ml-3 border-none p-1 md:hidden"
			on:click={() => (open = true)}
		>
			<BarsOutline size="xl" /></Button
		>
		<span
			class="invisible ml-2 self-center whitespace-nowrap text-xl font-semibold
			md:visible dark:text-white">Ziggurat</span
		>
	</NavBrand>
	<NavUl class="grow" classUl="md:space-x-0 gap-3" {activeUrl} {activeClass} {nonActiveClass}>
		{#each routes as route}
			<NavLi href={route.url} active={route.url === '/'} class="mx-2 text-lg">
				{route.text}
			</NavLi>
		{/each}
	</NavUl>
	<div class="flex items-center">
		<DarkMode />
		{#if $account}
			<Button pill color="none" class="p-0" on:click={() => ($openAccountModal = true)}
				><Avatar>{$account?.slice(0, 2)}</Avatar></Button
			>
		{:else}
			<Button pill class="ml-3" on:click={() => ($openAccountModal = true)}>Sign in</Button>
		{/if}
	</div>
</Navbar>
<Modal
	title="Ziggurat"
	class="h-auto overflow-hidden rounded-none rounded-none rounded-t-2xl rounded-t-2xl border
	border-white border-opacity-10 md:w-[400px] md:rounded-b-2xl
	dark:divide-white dark:divide-opacity-10 dark:border-white dark:border-opacity-10 dark:bg-gray-900"
	bind:open
	placement="bottom-center"
	autoclose
	outsideclose
	classDialog="p-0 h-screen"
	classHeader="bg-transparent dark:bg-transparent"
	classBody="p-0 md:p-0"
	classBackdrop="bg-gray-900"
>
	<div class="flex h-[60dvh] flex-col items-stretch">
		{#each routes as route}
			<button
				class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
				on:click={() => {
					goto(route.url);
					open = false;
				}}
			>
				<div class="flex items-center gap-3">
					<span class="font-medium">{route.text}</span>
				</div>
			</button>
		{/each}
	</div>
</Modal>
<AccountModal bind:open={$openAccountModal} />

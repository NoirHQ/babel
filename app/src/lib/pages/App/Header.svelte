<script lang="ts">
	import { page } from '$app/stores';
	import { Button, DarkMode, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	import { Logo } from '$lib/components';

	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
</script>

<Navbar
	class="fixed start-0 top-0 z-20 mx-0 w-full border-b border-none px-2 py-1.5 sm:px-4
	dark:bg-gray-900"
	fluid={true}
>
	<NavBrand href="/" class="p-2 text-2xl">
		<Logo class="fill-black dark:fill-white" />
		<span class="ml-2 self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Ziggurat</span
		>
	</NavBrand>
	<NavUl class="grow" classUl="md:space-x-0 gap-3" {activeUrl} {activeClass} {nonActiveClass}>
		<NavLi href="/" active={true} class="mx-2 text-lg">Trade</NavLi>
		<NavLi href="#" class="mx-2 text-lg">Pool🚧</NavLi>
	</NavUl>
	<DarkMode />
	<Button pill class="ml-3">Sign in</Button>
</Navbar>

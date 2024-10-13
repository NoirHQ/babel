<script lang="ts">
	import { Footer, FooterCopyright, FooterIcon, Icons } from '$lib/flowbite';
</script>

<Footer>
	<div class="flex w-full bg-gray-100 p-6 dark:bg-gray-800">
		<div class="flex grow justify-start">
			<FooterCopyright href="/" by="Haderech" year="" />
		</div>
		<div>
			<FooterIcon href="https://github.com/noirhq/babel/tree/ziggurat" target="_blank">
				<Icons.GithubSolid size="lg" />
			</FooterIcon>
		</div>
	</div>
</Footer>

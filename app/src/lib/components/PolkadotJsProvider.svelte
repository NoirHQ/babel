<script lang="ts">
	import { ApiPromise, WsProvider } from '@polkadot/api';
	import { polkadotJsApi } from '$lib/store';

	export let endpoint = 'ws://localhost:9944';

	(async () => {
		const provider = new WsProvider(endpoint, false);

		await provider.connect();
		if (provider.isConnected) {
			const api = await ApiPromise.create({
				provider,
				types: {
					VarAddress: {
						_enum: {
							Polkadot: 'AccountId32',
							Cosmos: '[u8; 20]',
							Ethereum: '[u8; 20]'
						}
					}
				}
			});
			polkadotJsApi.set(api);
		}
	})();
</script>

<slot />

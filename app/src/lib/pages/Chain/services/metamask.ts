import { Ethereum } from "$lib/constants";

export async function addEthereumChain() {
	if (!globalThis.ethereum) {
		window.open(
			'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
		);
	}

	await globalThis.ethereum.request({
		method: 'wallet_addEthereumChain',
		params: [
			{
				chainId: Ethereum.chainId,
				chainName: 'Ziggurat',
				rpcUrls: [Ethereum.endpoint],
				iconUrls: [],
				nativeCurrency: {
					name: 'Ziggurat',
					symbol: 'ZIG',
					decimals: 18
				},
				blockExplorerUrls: []
			}
		]
	});
}

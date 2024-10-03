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
				chainId: '0x539',
				chainName: 'Ziggurat',
				rpcUrls: ['http://localhost:8545'],
				iconUrls: [],
				nativeCurrency: {
					name: 'ZIG',
					symbol: 'ZIG',
					decimals: 18
				},
				blockExplorerUrls: []
			}
		]
	});
}

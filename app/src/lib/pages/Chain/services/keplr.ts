import { Cosmos } from '$lib/constants';

const coinDenom = 'ZIG';
const coinMinimalDenom = 'azig';
const coinGeckoId = 'ziggurat';
const coinDecimals = 18;

const currencies = {
	coinDenom,
	coinMinimalDenom,
	coinDecimals,
	coinGeckoId
};

const config = {
	chainId: Cosmos.chainId,
	chainName: 'Ziggurat',
	rpc: Cosmos.endpoint,
	rest: Cosmos.endpoint,
	bip44: {
		coinType: 118
	},
	bech32Config: {
		bech32PrefixAccAddr: 'cosmos',
		bech32PrefixAccPub: 'cosmospub',
		bech32PrefixValAddr: 'cosmospubvaloper',
		bech32PrefixValPub: 'cosmospubvaloperpub',
		bech32PrefixConsAddr: 'cosmospubvalcons',
		bech32PrefixConsPub: 'cosmospubvalconspub'
	},
	currencies: [currencies],
	feeCurrencies: [
		{
			...currencies,
			gasPriceStep: {
				low: 0.8,
				average: 1,
				high: 1.3
			}
		}
	],
	stakeCurrency: currencies
};

export async function suggestChain() {
	if (!globalThis.keplr) {
		window.open(
			'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap'
		);
	}

	try {
		await globalThis.keplr.experimentalSuggestChain(config);
	} catch (e: any) {
		console.error(e);
	}
}

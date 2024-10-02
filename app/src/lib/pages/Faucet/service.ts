import { PUBLIC_FAUCET_URL as url } from '$env/static/public';

export async function faucetRequest(address: string, recaptcha: string, assetId: number) {
	const body = { address, recaptcha, asset_id: assetId };

	if (!url) {
		throw new Error('Faucet endpoint is not defined');
	}

	const fetchResult = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
	});

	const result = await fetchResult.json();
	if ('error' in result) {
		throw new Error(result.error);
	} else {
		return result.hash;
	}
}

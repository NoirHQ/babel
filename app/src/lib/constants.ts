import * as env from '$env/static/public';

export namespace Ethereum {
	export const chainId = env?.PUBLIC_ETHEREUM_CHAIN_ID ?? '0x401';
	export const endpoint = env?.PUBLIC_ETHEREUM_ENDPOINT ?? 'http://localhost:8545';
}

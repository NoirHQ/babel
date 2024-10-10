import * as env from '$env/static/public';
import { Token } from '$lib/types';

const ZIGGURAT_CHAIN_ID = 0x401;

export const ZIG = new Token(
	ZIGGURAT_CHAIN_ID,
	env?.PUBLIC_ERC20_ZIG_ADDRESS ?? '0x0000000000000000000000000000000000000401',
	18,
	'ZIG',
	'Ziggurat'
);

export const RAT = new Token(
	ZIGGURAT_CHAIN_ID,
	env?.PUBLIC_ERC20_RAT_ADDRESS ?? '0xffffffff00000000000000000000000000000001',
	18,
	'RAT',
	'RatCoin'
);

export namespace Ethereum {
	export const chainId = env?.PUBLIC_ETHEREUM_CHAIN_ID ?? '0x401';
	export const endpoint = env?.PUBLIC_ETHEREUM_ENDPOINT ?? 'http://localhost:8545';
}

export namespace UniswapV2 {
	export const factoryAddress = env?.PUBLIC_UNISWAP_V2_FACTORY_ADDRESS ?? '0x';
	export const routerAddress = env?.PUBLIC_UNISWAP_V2_ROUTER_ADDRESS ?? '0x';
	// https://github.com/conr2d/uniswap-v2/blob/dcfcd52e45ed78e92b7d2b06e501c47a789dacf9/contracts/UniswapV2Pair.sol
	// solc: 0.8.19, optimization: 999999
	export const initCodeHash =
		env?.PUBLIC_UNISWAP_V2_INIT_CODE_HASH ??
		'0xaa94b91bc27aacf711d3d7b628e82c46cd79caf4a8b36287501f6ed3f69b5552';
}

export namespace Cosmos {
	export const endpoint = env?.PUBLIC_COSMOS_ENDPOINT ?? 'http://localhost:1317';
	export const chainId = env?.PUBLIC_COSMOS_CHAIN_ID ?? 'ziggurat-1';
	export const dispatch =
		env?.PUBLIC_COSMOS_DISPATCH_CONTRACT ??
		'cosmos1d4hkgmryd9ehqct5vd5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqel3ghf';
}

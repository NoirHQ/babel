import { bech32 } from '@scure/base';
import type { Provider } from 'ethers';
import { ethers, JsonRpcProvider } from 'ethers';
import { UniswapV2Pair } from '$lib/abi';
import { Ethereum, UniswapV2 } from '$lib/constants';
import { CurrencyAmount, Pair, Token } from '$lib/types';
import { getCreate2Address } from '@ethersproject/address';
import { pack, keccak256 } from '@ethersproject/solidity';

export function parseAmount(amount: string): string {
	let integer, fraction;
	let factor = 18;
	if (amount.includes('.')) {
		[integer, fraction] = amount.split('.');
		factor -= fraction.length;
		if (factor < 0) {
			throw new Error('Too many decimal places');
		}
	} else {
		integer = amount;
		fraction = '';
	}
	return '0x' + BigInt(integer + fraction + '0'.repeat(factor)).toString(16);
}

export function sortTokens(tokenA: Token, tokenB: Token): [Token, Token] {
	return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
}

export let ethersProvider: Provider = new JsonRpcProvider(Ethereum.endpoint);

export function setEthersProvider(provider: Provider) {
	ethersProvider = provider;
}

export async function createPair(tokenA: Token, tokenB: Token): Promise<Pair> {
	const [token0, token1] = sortTokens(tokenA, tokenB);

	const pairAddress = getCreate2Address(
		UniswapV2.factoryAddress,
		keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
		UniswapV2.initCodeHash
	);

	const pairContract = new ethers.Contract(pairAddress, UniswapV2Pair, ethersProvider);
	const [reserve0, reserve1] = await pairContract.getReserves();

	const pair = new Pair(
		CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
		CurrencyAmount.fromRawAmount(token1, reserve1.toString())
	);
	return pair;
}

export function tokenSymbolFromAddress(address: string | null): string {
	if (address === null) {
		return 'ZIG';
	} else if (address.startsWith('0x')) {
		return 'ETH';
	} else if (address.startsWith('cosmos1')) {
		return 'ATOM';
	} else {
		return 'DOT';
	}
}

export namespace Babel {
	export type VarAddress = {
		Cosmos?: string;
		Ethereum?: string;
		Polkadot?: string;
	};

	export function address(s: string): VarAddress {
		if (s.startsWith('0x')) {
			return { Ethereum: s };
		} else if (s.startsWith('cosmos1')) {
			return { Cosmos: bech32.fromWords(bech32.decode(s).words) };
		} else {
			return { Polkadot: s };
		}
	}

	export function denom(token: Token): string | undefined {
		const known: Record<string, string> = {
			ZIG: 'azig',
			RAT: 'arat'
		};
		return token?.symbol ? known[token.symbol] : undefined;
	}

	export function addressToAssetId(address: string | undefined): number | null {
		if (!address) return null;
		let normalized = address.toLowerCase();
		normalized = normalized.startsWith('0x') ? normalized.slice(2) : normalized;
		if (!normalized.startsWith('ffffffff000000000000000000000000')) return null;
		return parseInt(normalized.slice(32), 16);
	}
}

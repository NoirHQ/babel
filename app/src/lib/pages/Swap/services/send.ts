import { get } from 'svelte/store';
import { ethers } from 'ethers';
import { BabelPrecompile, IERC20 } from '$lib/abi';
import { account, accountProvider, polkadotJsApi } from '$lib/store';
import { Token } from '$lib/types';
import { Babel, ethersProvider } from '$lib/utils';

type VarAddress = Babel.VarAddress;

function isNativeCurrency(currency: Token | null): boolean {
	return currency === null || currency.symbol === 'ZIG';
}

async function babelTransferFromEthereum(
	assetId: null | number,
	from: VarAddress,
	to: VarAddress,
	value: string
) {
	const api = get(polkadotJsApi);
	if (api === null) return;
	const call = api.tx.babel.transfer(assetId, to, value).inner.toHex();
	const signer = await ethersProvider.getSigner(from.Ethereum);
	const babelContract = new ethers.Contract(
		'0x0000000000000000000000000000000000000400',
		BabelPrecompile,
		signer
	);
	// XXX: eth_call should return an actual gas fee.
	babelContract.dispatch(call, { gasLimit: 100_000 });
}

export async function sendERC20(currency: Token | null, recipient: string, value: string) {
	const sender = get(account);
	if (!sender) return;
	const from = Babel.address(sender);
	const to = Babel.address(recipient);
	if (from.hasOwnProperty('Ethereum')) {
		if (to.hasOwnProperty('Ethereum')) {
			const address = currency?.address || '0x0000000000000000000000000000000000000401';
			const signer = await ethersProvider.getSigner(from.Ethereum);
			const erc20Contract = new ethers.Contract(address, IERC20, signer);
			erc20Contract.transfer(to.Ethereum, value);
		} else {
			const assetId = Babel.addressToAssetId(currency?.address);
			if (!isNativeCurrency(currency) && assetId === null) {
				console.error('EVM-only erc20 cannot be transferred to non-EVM accounts.');
				return;
			}
			babelTransferFromEthereum(assetId, from, to, value);
		}
	} else {
		const assetId = Babel.addressToAssetId(currency?.address);
		if (!isNativeCurrency(currency) && assetId === null) {
			console.error('EVM-only erc20 cannot be transferred to non-EVM accounts.');
			return;
		}
		const api = get(polkadotJsApi);
		if (api === null) return;
		const signer = get(accountProvider)?.provider.signer;
		if (!signer) return;
		api.tx.babel.transfer(assetId, to, value).signAndSend(from.Polkadot, { signer });
	}
}

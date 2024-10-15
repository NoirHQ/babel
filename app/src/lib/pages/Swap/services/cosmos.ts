import { accountProvider, polkadotJsApi as api } from '$lib/store';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import type { SignerData } from '@cosmjs/stargate';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { get } from 'svelte/store';
import { Buffer } from 'buffer';
import { Cosmos } from '$lib/constants';
import { Token } from '$lib/types';
import { Babel } from '$lib/utils';

async function sequenceOf(address: string): Promise<number> {
	const {
		account: { sequence }
	} = await (await fetch(`${Cosmos.endpoint}/cosmos/auth/v1beta1/accounts/${address}`)).json();
	return parseInt(sequence);
}

export async function getSignerData(address: string): Promise<SignerData> {
	const sequence = await sequenceOf(address);
	return {
		accountNumber: 0,
		sequence,
		chainId: Cosmos.chainId
	};
}

async function sendTokens(
	token: Token,
	sender: string,
	recipient: string,
	value: string
): Promise<string> {
	if (get(accountProvider) === null) {
		throw new Error('Cosmos provider is not unavailable');
	}
	const offlineSigner = get(accountProvider)?.provider.getOfflineSigner(Cosmos.chainId);
	const client = await SigningCosmWasmClient.offline(offlineSigner);
	const signerData = await getSignerData(sender);

	const msgSend = {
		typeUrl: MsgSend.typeUrl,
		value: {
			fromAddress: sender,
			toAddress: recipient,
			amount: [{ denom: Babel.denom(token), amount: BigInt(value).toString() }]
		}
	};

	const fee = {
		amount: [
			{
				denom: 'azig',
				amount: '1000000000'
			}
		],
		gas: '1000000000'
	};

	const txRaw = await client.sign(sender, [msgSend], fee, '', signerData);
	const txBytes = TxRaw.encode(txRaw).finish();
	const hash = await get(accountProvider)?.provider.sendTx(Cosmos.chainId, txBytes, 'sync');

	return `0x${Buffer.from(hash).toString('hex')}`;
}

function transferCall(token: Token, recipient: string, value: string): string {
	const to = Babel.address(recipient);
	const assetId = Babel.addressToAssetId(token.address);
	if (token.symbol !== 'ZIG' && assetId === null) {
		throw new Error('EVM-only erc20 cannot be transferred to non-EVM accounts.');
	}
	const call = get(api)?.tx.babel.transfer(assetId, to, value).inner.toHex();
	return Buffer.from(call.startsWith('0x') ? call.slice(2) : call, 'hex').toString('base64');
}

export function getExecuteDispatchCall(sender: string, call: string) {
	return {
		typeUrl: MsgExecuteContract.typeUrl,
		value: {
			sender,
			contract: Cosmos.dispatch,
			msg: Buffer.from(
				JSON.stringify({
					dispatch: {
						input: call
					}
				}),
				'utf8'
			),
			funds: []
		}
	};
}

async function transferBalance(
	token: Token,
	sender: string,
	recipient: string,
	value: string
): Promise<string> {
	if (get(accountProvider) === null) {
		throw new Error('Cosmos provider is not unavailable');
	}
	if (get(api) === null) {
		throw new Error('Polkadot provider is not unavailable');
	}

	const offlineSigner = get(accountProvider)?.provider.getOfflineSigner(Cosmos.chainId);
	const client = await SigningCosmWasmClient.offline(offlineSigner);
	const signerData = await getSignerData(sender);

	const call = transferCall(token, recipient, value);
	const executeMsg = getExecuteDispatchCall(sender, call);

	const fee = {
		amount: [
			{
				denom: 'azig',
				amount: '1000000000'
			}
		],
		gas: '1000000000'
	};

	const txRaw = await client.sign(sender, [executeMsg], fee, '', signerData);
	const txBytes = TxRaw.encode(txRaw).finish();
	const hash = await get(accountProvider)?.provider.sendTx(Cosmos.chainId, txBytes, 'sync');

	return `0x${Buffer.from(hash).toString('hex')}`;
}

export async function transfer(
	token: Token,
	sender: string,
	recipient: string,
	value: string
): Promise<string> {
	if (recipient.startsWith('cosmos1')) {
		return sendTokens(token, sender, recipient, value);
	} else {
		return transferBalance(token, sender, recipient, value);
	}
}

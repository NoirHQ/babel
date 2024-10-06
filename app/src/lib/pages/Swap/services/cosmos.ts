import {
	PUBLIC_COSMOS_REST as endpoint,
	PUBLIC_COSMOS_CHAIN_ID as chainId,
	PUBLIC_COSMOS_DISPATCH_CONTRACT as contract,
} from '$env/static/public';
import { accountProvider, polkadotJsApi as api } from '$lib/store';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import type { SignerData } from '@cosmjs/stargate';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { get } from 'svelte/store';
import { Buffer } from 'buffer';

const msgSendFee = {
	amount: [
		{
			denom: 'azig',
			amount: '320000000'
		}
	],
	gas: '320000000'
};

const msgExecuteFee = {
	amount: [
		{
			denom: 'azig',
			amount: '360000000'
		}
	],
	gas: '360000000'
};

async function sequenceOf(address: string): Promise<number> {
	const {
		account: { sequence }
	} = await (
		await fetch(
			`${endpoint}/cosmos/auth/v1beta1/accounts/${address}`
		)
	).json();
	return parseInt(sequence);
}

async function getSignerData(address: string): Promise<SignerData> {
	const sequence = await sequenceOf(address);
	return {
		accountNumber: 0,
		sequence,
		chainId
	};
}

async function sendTokens(sender: string, recipient: string, value: string): Promise<string> {
	if (get(accountProvider) === null) {
		throw new Error('Cosmos provider is not unavailable');
	}
	const offlineSigner = get(accountProvider)?.provider.getOfflineSigner(chainId);
	const client = await SigningCosmWasmClient.offline(offlineSigner);
	const signerData = await getSignerData(sender);

	const msgSend = {
		typeUrl: MsgSend.typeUrl,
		value: {
			fromAddress: sender,
			toAddress: recipient,
			amount: [{ denom: 'azig', amount: BigInt(value).toString() }]
		}
	};

	const txRaw = await client.sign(sender, [msgSend], msgSendFee, '', signerData);
	const txBytes = TxRaw.encode(txRaw).finish();
	const hash = await get(accountProvider)?.provider.sendTx(
		chainId,
		txBytes,
		'sync'
	);

	return `0x${Buffer.from(hash).toString('hex')}`;
}

function transferCall(recipient: string, value: string): string {
	let to;
	if (recipient.startsWith('0x')) {
		to = { Ethereum: recipient };
	} else {
		to = { Polkadot: recipient };
	}

	const call = get(api)?.tx.babel.transfer(to, value).inner.toHex();
	return Buffer.from(
		call.startsWith('0x') ? call.slice(2) : call,
		'hex'
	).toString('base64');
}

async function transferBalance(sender: string, recipient: string, value: string): Promise<string> {
	if (get(accountProvider) === null) {
		throw new Error('Cosmos provider is not unavailable');
	}
	if (get(api) === null) {
		throw new Error('Polkadot provider is not unavailable');
	}

	const offlineSigner = get(accountProvider)?.provider.getOfflineSigner(chainId);
	const client = await SigningCosmWasmClient.offline(offlineSigner);
	const signerData = await getSignerData(sender);

	const call = transferCall(recipient, value);
	const executeMsg = {
		typeUrl: MsgExecuteContract.typeUrl,
		value: {
			sender,
			contract,
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

	const txRaw = await client.sign(
		sender,
		[executeMsg],
		msgExecuteFee,
		'',
		signerData
	);
	const txBytes = TxRaw.encode(txRaw).finish();
	const hash = await get(accountProvider)?.provider.sendTx(
		chainId,
		txBytes,
		'sync'
	);

	return `0x${Buffer.from(hash).toString('hex')}`;
}

export async function transfer(sender: string, recipient: string, value: string): Promise<string> {
	if (recipient.startsWith('cosmos1')) {
		return sendTokens(sender, recipient, value);
	} else {
		return transferBalance(sender, recipient, value);
	}
}

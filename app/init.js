import * as util from 'util';
import { ApiPromise, Keyring } from '@polkadot/api';

const options = {
	sudo: {
		type: 'string'
	},
	owner: {
		type: 'string'
	},
	amount: {
		type: 'string'
	}
};
const { values } = util.parseArgs({ options });

async function main() {
	const api = await ApiPromise.create();

	const keyring = new Keyring({ type: 'sr25519' });

	const sudo = values.sudo
		? keyring.createFromUri(values.sudo)
		: keyring.createFromUri('//Alice');
	const owner = values.owner
		? keyring.createFromUri(values.owner)
		: keyring.createFromUri('//Alice');
	const amount = values.amount || '1000000000000000000000000000';

	const RAT = {
		id: 1,
		name: 'RatCoin',
		symbol: 'RAT',
		denom: 'arat',
		decimals: 18,
		isFrozen: false,
		isSufficient: false,
		owner: owner.address,
		minBalance: '1000000000000000'
	};

	const args = { api, sudo, owner, amount, RAT };

	const unsubSudo = await api.tx.sudo
		.sudo(api.tx.babel.forceCreateAsset(...Object.values(RAT)).inner.toHex())
		.signAndSend(sudo, async (result) => {
			if (result.status.isInBlock) {
				unsubSudo();
				console.log(`Created     | RatCoin (id: ${RAT.id}, symbol: RAT)`);
				if (sudo.address != owner.address) {
					await fund(args);
				} else {
					await mint(args);
				}
			}
		});
}

async function fund(args) {
	const { api, sudo, owner } = args;
	const unsubTransfer = await api.tx.balances
		.transferKeepAlive(owner.address, '1000000000000000000')
		.signAndSend(sudo, async (result) => {
			if (result.status.isInBlock) {
				unsubTransfer();
				console.log(`Transferred | 1 ZIG to ${owner.address} for tx fees.`);
				await mint(args);
			}
		});
}

async function mint(args) {
	const { api, RAT, owner, amount } = args;
	const unsubMint = await api.tx.assets
		.mint(RAT.id, owner.address, amount)
		.signAndSend(owner, (result) => {
			if (result.status.isInBlock) {
				unsubMint();
				console.log(`Minted      | ${amount} RAT to ${owner.address}.`);
				process.exit(0);
			}
		});
}

main();

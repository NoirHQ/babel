<script lang="ts">
	import type { ContractTransaction } from 'ethers';
	import { Button } from 'flowbite-svelte';
	import { ArrowDownOutline } from 'flowbite-svelte-icons';
	import { ethers } from 'ethers';
	import { TabItem } from '$lib/components';
	import { Ethereum } from '$lib/constants';
	import SwapCurrencyInput from './SwapCurrencyInput.svelte';
	import { IERC20, UniswapV2Router02 } from '$lib/abi';
	import { UniswapV2 } from '$lib/constants';
	import {
		account,
		accountProvider,
		addresses,
		openAccountModal,
		polkadotJsApi as api,
		toast
	} from '$lib/store';
	import { CurrencyAmount, Pair, Percent, Route, Token, Trade, TradeType } from '$lib/types';
	import { createPair, ethersProvider, parseAmount, sortTokens } from '$lib/utils';
	import { MaxUint256 } from 'ethers';

	export let open = false;

	let exactInput = true;

	let input: Token | null = null;
	let inputAmount = '';
	let inputBalance = '';

	let output: Token | null = null;
	let outputAmount = '';
	let outputBalance = '';

	let tokens: Token[] = [];
	let pair: Pair | null = null;
	let fetching = false;
	let timeoutId: number = 0;

	$: {
		if (input && output) {
			const sorted = sortTokens(input, output);
			if (tokens !== sorted) {
				tokens = sorted;
				updatePair(true);
			}
		}
	}
	$: route = input && output && !fetching ? new Route([pair], input, output) : null;

	$: inputAmount = !exactInput && pair ? getInputAmount(pair) : inputAmount;
	$: outputAmount = exactInput && pair ? getOutputAmount(pair) : outputAmount;

	function updatePair(retry: boolean = false) {
		if (retry && timeoutId !== 0) {
			clearTimeout(timeoutId);
			timeoutId = 0;
		}
		fetching = true;
		(async () => {
			pair = await createPair(tokens[0], tokens[1]);
			fetching = false;
		})();
		if (retry) {
			timeoutId = setTimeout(() => updatePair(true), 6000);
		}
	}

	const notReadyAmount = /^(0|0\.)?0*$/;

	function getOutputAmount(pair: Pair) {
		if (!pair || !input || notReadyAmount.test(inputAmount)) return;
		try {
			return pair
				.getOutputAmount(CurrencyAmount.fromRawAmount(input, parseAmount(inputAmount)))[0]
				.toSignificant(6);
		} catch (e) {
			return '';
		}
	}

	function getInputAmount(pair: Pair) {
		if (!pair || !output || notReadyAmount.test(outputAmount)) return;
		try {
			return pair
				.getInputAmount(CurrencyAmount.fromRawAmount(output, parseAmount(outputAmount)))[0]
				.toSignificant(6);
		} catch (e) {
			return '';
		}
	}

	function onChangeInputAmount() {
		if (!pair) return;
		if (inputAmount === '') {
			outputAmount = '';
			return;
		}
		exactInput = true;
		if (inputAmount === '0' || inputAmount === '0.') return;
		outputAmount = getOutputAmount(pair);
	}

	function onChangeOutputAmount() {
		if (!pair) return;
		if (outputAmount === '') {
			inputAmount = '';
			return;
		}
		exactInput = false;
		if (outputAmount === '0' || outputAmount === '0.') return;
		inputAmount = getInputAmount(pair);
	}

	function swapCurrencies() {
		[input, output] = [output, input];
		if (exactInput) {
			exactInput = !exactInput;
			outputAmount = inputAmount;
			inputAmount = getInputAmount(pair);
		} else {
			exactInput = !exactInput;
			inputAmount = outputAmount;
			outputAmount = getOutputAmount(pair);
		}
	}

	function onSelectInputCurrency(selected: Token) {
		if (selected === output) {
			swapCurrencies();
		} else {
			input = selected;
		}
	}

	function onSelectOutputCurrency(selected: Token) {
		if (selected === input) {
			swapCurrencies();
		} else {
			output = selected;
		}
	}

	function notifySentSwapTransaction() {
		$toast.message = 'Swap transaction is sent';
		$toast.dismissable = true;
		$toast.status = true;
		setTimeout(() => {
			$toast.status = false;
		}, 5000);
	}

	async function approveEthereumAccount(signer, amountIn: bigint) {
		const inputContract = new ethers.Contract(route.input.address, IERC20, signer);
		const allowance = await inputContract.allowance($account, UniswapV2.routerAddress);
		if (amountIn > allowance) {
			$toast.message = 'Need to approve first. Please sign and wait...';
			$toast.status = true;
			const approval = await inputContract.approve(UniswapV2.routerAddress, MaxUint256);
			await approval.wait();
		}
	}

	async function approveAndSwapPolkadotAccount(address: string, amountIn: bigint, txData) {
		const inputContract = new ethers.Contract(route.input.address, IERC20, ethersProvider);
		const allowance = await inputContract.allowance(address, UniswapV2.routerAddress);
		if (amountIn > allowance) {
			const txData = await decoratePopulatedTransaction(
				inputContract.approve.populateTransaction(UniswapV2.routerAddress, MaxUint256),
				100_000
			);
			$toast.message = 'Need to approve first. Please sign and wait...';
			$toast.dismissable = false;
			$toast.status = true;
			let unsub_swap = null;
			const unsub = await $api.tx.babel.ethereumTransact(txData).signAndSend(
				$account,
				{
					signer: $accountProvider.provider.signer
				},
				async (result) => {
					if (result.status.isInBlock) {
						unsub_swap = await $api.tx.babel.ethereumTransact(txData).signAndSend(
							$account,
							{
								signer: $accountProvider.provider.signer
							},
							(result) => {
								if (result.status.isInBlock) {
									updatePair(false);
									if (unsub_swap) unsub_swap();
								}
							}
						);
						notifySentSwapTransaction();
						unsub();
					}
				}
			);
		} else {
			await $api.tx.babel.ethereumTransact(txData).signAndSend(
				$account,
				{
					signer: $accountProvider.provider.signer
				},
				(result) => {
					if (result.status.isInBlock) {
						updatePair(false);
					}
				}
			);
			notifySentSwapTransaction();
		}
	}

	async function decoratePopulatedTransaction(
		promise: Promise<ContractTransaction>,
		gasLimit: number = 21_000
	) {
		const tx = ethers.Transaction.from(await promise);
		// XXX
		{
			tx.chainId = Ethereum.chainId; // not mandatory
			tx.nonce = (await $api.query.system.account($account)).nonce.toPrimitive();
			tx.gasLimit = gasLimit;
			tx.maxFeePerGas = 500_000_000;
		}
		// Transaction.unsigedSerialized doesn't have (v, r, s), so append '808080'.
		return $api.createType('Bytes', tx.unsignedSerialized + '808080');
	}

	async function swap() {
		if (!route) return;
		const slippageTolerance = new Percent('50', '10000');
		if (exactInput) {
			const trade = new Trade(
				route,
				CurrencyAmount.fromRawAmount(input, parseAmount(inputAmount)),
				TradeType.EXACT_INPUT
			);
			const amountIn = BigInt(parseAmount(trade.inputAmount.toExact()));
			const amountOutMin = BigInt(
				parseAmount(trade.minimumAmountOut(slippageTolerance).toExact())
			);
			const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

			if ($account.startsWith('0x')) {
				const signer = await ethersProvider.getSigner();
				await approveEthereumAccount(signer, amountIn);

				const contract = new ethers.Contract(
					UniswapV2.routerAddress,
					UniswapV2Router02,
					signer
				);
				const swapped = await contract.swapExactTokensForTokens(
					amountIn,
					amountOutMin,
					[trade.route.path[0].address, trade.route.path[1].address],
					$account,
					deadline
				);
				notifySentSwapTransaction();
				await swapped.wait();
				updatePair(false);
			} else if ($account.startsWith('cosmos1')) {
				// Cosmos swap
			} else {
				if ($api === null) return;
				const to = $addresses.find((address) => address.startsWith('0x'));
				if (!to) console.error('Non-unified account');
				const contract = new ethers.Contract(
					UniswapV2.routerAddress,
					UniswapV2Router02,
					ethersProvider
				);
				const txData = await decoratePopulatedTransaction(
					contract.swapExactTokensForTokens.populateTransaction(
						amountIn,
						amountOutMin,
						[trade.route.path[0].address, trade.route.path[1].address],
						to,
						deadline
					),
					700_000
				);
				await approveAndSwapPolkadotAccount(to, amountIn, txData);
			}
		} else {
			const trade = new Trade(
				route,
				CurrencyAmount.fromRawAmount(output, parseAmount(outputAmount)),
				TradeType.EXACT_OUTPUT
			);
			const amountOut = BigInt(parseAmount(trade.outputAmount.toExact()));
			const amountInMax = BigInt(
				parseAmount(trade.maximumAmountIn(slippageTolerance).toExact())
			);
			const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

			if ($account.startsWith('0x')) {
				const signer = await ethersProvider.getSigner();
				await approveEthereumAccount(signer, amountInMax);

				const contract = new ethers.Contract(
					UniswapV2.routerAddress,
					UniswapV2Router02,
					signer
				);
				const swapped = await contract.swapTokensForExactTokens(
					amountOut,
					amountInMax,
					[trade.route.path[0].address, trade.route.path[1].address],
					$account,
					deadline
				);
				notifySentSwapTransaction();
				await swapped.wait();
				updatePair(false);
			} else if ($account.startsWith('cosmos1')) {
				// Cosmos swap
			} else {
				if ($api === null) return;
				const to = $addresses.find((address) => address.startsWith('0x'));
				if (!to) console.error('Non-unified account');
				const contract = new ethers.Contract(
					UniswapV2.routerAddress,
					UniswapV2Router02,
					ethersProvider
				);
				const txData = await decoratePopulatedTransaction(
					contract.swapTokensForExactTokens.populateTransaction(
						amountOut,
						amountInMax,
						[trade.route.path[0].address, trade.route.path[1].address],
						to,
						deadline
					),
					700_000
				);
				await approveAndSwapPolkadotAccount(to, amountInMax, txData);
			}
		}
	}
</script>

<TabItem {open}>
	<span slot="title">Swap</span>
	<form class="flex flex-col gap-1">
		<SwapCurrencyInput
			label="Sell"
			bind:value={inputAmount}
			bind:currency={input}
			on:input={onChangeInputAmount}
			onSelectCurrency={onSelectInputCurrency}
		/>
		<button
			class="z-10 my-[-22px] inline-flex h-10 w-10 self-center rounded-xl
				border-4 border-white bg-gray-100 dark:border-gray-900 dark:bg-gray-800"
			on:click={swapCurrencies}
		>
			<div
				class="flex h-full w-full items-center justify-center hover:bg-gray-400 hover:bg-opacity-5"
			>
				<ArrowDownOutline class="dark:text-white" />
			</div>
		</button>
		<SwapCurrencyInput
			label="Buy"
			bind:value={outputAmount}
			bind:currency={output}
			on:input={onChangeOutputAmount}
			onSelectCurrency={onSelectOutputCurrency}
		/>
		{#if $account === null}
			<Button
				size="xl"
				class="overflow-hidden rounded-2xl bg-opacity-20 p-0 text-xl
				font-medium text-primary-600 hover:bg-opacity-20 dark:bg-opacity-20
				dark:hover:bg-opacity-20"
				on:click={() => ($openAccountModal = true)}
			>
				<div class="w-full p-4 hover:bg-gray-400 hover:bg-opacity-5">
					Connect wallet
				</div></Button
			>
		{:else if !inputAmount || !outputAmount}
			<Button
				size="xl"
				color="none"
				class="rounded-2xl bg-gray-100 text-xl
				font-medium text-gray-300 dark:bg-gray-800 dark:text-gray-600">Enter an amount</Button
			>
		{:else}
			<Button size="xl" class="rounded-2xl text-xl font-medium" on:click={swap}>Swap</Button>
		{/if}
	</form>
</TabItem>

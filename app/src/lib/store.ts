import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const account: Writable<string | null> = writable(null);

export const accountProvider = writable(null);

export const addresses = writable([]);

export const openAccountModal = writable(false);

export const openCurrencySelector = writable(false);

export const onSelectCurrency = writable((_) => {});

export const polkadotJsApi = writable(null);

export const toast = writable({
	status: false,
	message: '',
	dismissable: false
});

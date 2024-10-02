import { writable } from 'svelte/store';

export const account = writable(null);

export const accountProvider = writable(null);

export const openAccountModal = writable(false);

export const openCurrencySelector = writable(false);

export const onSelectCurrency = writable((_) => {});

export const polkadotJsApi = writable(null);

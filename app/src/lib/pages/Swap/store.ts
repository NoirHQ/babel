import { writable } from 'svelte/store';

export const account = writable(null);

export const modalOpen = writable(false);

export const onSelectCurrency = writable((currency) => {});

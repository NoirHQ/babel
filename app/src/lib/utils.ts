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

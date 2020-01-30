import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numberSuffixesShared'
})
export class NumberSuffixesSharedPipe implements PipeTransform {

	transform(number: number, args?: any, decimal?: any, noRounded?: boolean): any {
		if (isNaN(number)) { return null; } // will only work value is a number
		if (number === null) { return null; }
		// if (number === 0) { return null; }
		let abs = Math.abs(number);
		const rounder = Math.pow(10, 1);
		const isNegative = number < 0; // will also work for Negetive numbers
		let key = '';

		const powers = [
			{ key: 'Q', value: Math.pow(10, 15) },
			{ key: 'T', value: Math.pow(10, 12) },
			{ key: 'B', value: Math.pow(10, 9) },
			{ key: 'M', value: Math.pow(10, 6) },
			{ key: 'K', value: 1000 }
		];

		let reduced;
		if (args) {
			const p = powers.filter(p1 => p1.key === args)[0];
			reduced = abs / p.value;
			if (noRounded) {
				reduced = (reduced * rounder) / rounder;
			} else {
				reduced = Math.round(reduced * rounder) / rounder;
			}
			if (decimal || reduced < 1) {
				abs = reduced;
				key = p.key;
			} else {
				abs = reduced;
				key = p.key;
			}

		} else {
			for (let i = 0; i < powers.length; i++) {
				reduced = abs / powers[i].value;
				if (noRounded) {
					reduced = (reduced * rounder) / rounder;
				} else {
					reduced = Math.round(reduced * rounder) / rounder;
				}
				if (reduced >= 1) {
					if (decimal) {
						abs = reduced;
					} else {
						abs = reduced;
					}
					key = powers[i].key;
					break;
				} 
			}
		}
		// if (decimal) {
		// 	abs = +abs.toFixed(decimal);
		// } else {
		// 	abs = abs;
		// }
		return (isNegative ? '-' : '') + (decimal ? abs.toFixed(decimal) : Math.round(abs)) + ' ' + key;
	}

}

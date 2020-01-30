import { Pipe, PipeTransform } from '@angular/core';
import * as m from 'moment';
const moment = m;
@Pipe({
	name: 'momentDateShared'
})
export class MomentDateSharedPipe implements PipeTransform {

	transform(value: any, format: string, locale?: string): any {
		let lo = 'es';
		if (locale) {
			lo = locale;
		}

		return moment(value).locale(lo).format(format);
	}

}

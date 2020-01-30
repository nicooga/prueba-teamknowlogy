import { Pipe, PipeTransform } from '@angular/core';
import { MomentDateSharedPipe } from '../moment-date-pipe/moment-date.pipe';
@Pipe({
	name: 'niceDateFormatTimestampShared'
})
export class NiceDateFormatTimestampSharedPipe implements PipeTransform {

	transform(value: string, format: string = 'DD/MM/YYYY HH:ss') {

		const _value = Number(value);

		const dif = Math.floor(((Date.now() - _value) / 1000) / 86400);
		if (dif < 30) {
			return this.convertToNiceDate(value);
		} else {
			const datePipe = new MomentDateSharedPipe();
			value = datePipe.transform(value, format);
			return value;
		}
	}
	convertToNiceDate(time: string) {
		const date = new Date(time),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			daydiff = Math.floor(diff / 86400);

		if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31) {
			return '';
		}

		return daydiff === 0 && (
			diff < 60 && 'dates.just_now' ||
			diff < 120 && 'dates.1_minute_ago' ||
			diff < 3600 && 'dates.minutes_ago' ||
			diff < 7200 && 'dates.1_hour_ago' ||
			diff < 86400 && 'dates.hours_ago') ||
			daydiff === 1 && 'dates.yesterday' ||
			daydiff < 7 && 'dates.days_ago' ||
			daydiff < 31 && 'dates.weeks_ago';
	}
}


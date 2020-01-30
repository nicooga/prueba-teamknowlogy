import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment';

/**
 * @export
 * @class PaymentMethodPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'paymentMethodPipe' })
export class PaymentMethodPipe implements PipeTransform {
    /**
     * @param {string} value
     * @returns {string}
     * @memberof PaymentMethodPipe
     */
    transform(items: any[], filterType: any): any {
        const currentMonth = moment().format('MM');
        const lastMonthOneDigit = moment().format('M');
        const currentYear = moment().format('YYYY');

        switch (filterType) {
            case 'THIS_MONTH':
                return items ? items.filter(item => moment(item.startPeriod, 'DD/MM/YYYY').format('MM') === currentMonth &&
                    moment(item.endPeriod, 'DD/MM/YYYY').format('MM') === currentMonth) : [];
            case 'LAST_6_MONTHS':
                const monthToGet = +lastMonthOneDigit - 6 + 1;
                return items ? items.filter(item => (+moment(item.startPeriod, 'DD/MM/YYYY').format('M') >= monthToGet &&
                    moment(item.startPeriod, 'DD/MM/YYYY').format('YYYY') === currentYear) &&
                    (+moment(item.endPeriod, 'DD/MM/YYYY').format('M') >= monthToGet &&
                        moment(item.endPeriod, 'DD/MM/YYYY').format('YYYY') === currentYear)) : [];
            case 'THIS_YEAR':
                return items ? items.filter(item =>
                    moment(item.startPeriod, 'DD/MM/YYYY').format('YYYY') === currentYear &&
                    moment(item.endPeriod, 'DD/MM/YYYY').format('YYYY') === currentYear) : [];

            case 'ALL_PERIOD':
                return items ? items : [];

        }
    }
}

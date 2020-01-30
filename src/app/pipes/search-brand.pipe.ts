import { PipeTransform, Pipe } from '@angular/core';

/**
 * @export
 * @class SearchBrandPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'searchBrandPipe' })
export class SearchBrandPipe implements PipeTransform {
    /**
     * @param {string} value
     * @returns {string}
     * @memberof SearchBrandPipe
     */
    transform(items: any[], filterText: any, type: string): any {

        if (type === 'BRAND') {
            return items && filterText.length > 0 ?
                items.filter(item => item.name.search(new RegExp(filterText, 'i')) > -1 ||
                    item.username.search(new RegExp(filterText, 'i')) > -1)
                : [];
        }

        if (type === 'KEYWORD') {

            return items && filterText.length > 0 ?
                items.filter(item => item.keyword.search(new RegExp(filterText, 'i')) > -1) : [];
        }

        if (type === 'WEBPAGE') {

            return items && filterText.length > 0 ?
                items.filter(item => item.site.search(new RegExp(filterText, 'i')) > -1) : [];
        }

        if (type === 'FILTERS_DOUBLE') {
            return items ?
                items.filter(item => (item.name.search(new RegExp(filterText.brand, 'i')) > -1 ||
                    item.username.search(new RegExp(filterText.brand, 'i')) > -1) &&
                    item.status.search(new RegExp(filterText.status, 'i')) > -1)
                : [];
        }

        if (type === 'STRING') {
            return items ?
                items.filter(item => item.name.search(new RegExp(filterText, 'i')) > -1 ||
                    item.username.search(new RegExp(filterText, 'i')) > -1)
                : [];
        }
    }
}

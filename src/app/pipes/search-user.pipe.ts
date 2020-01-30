import { PipeTransform, Pipe } from '@angular/core';

/**
 * @export
 * @class SearchUserPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'searchUserPipe' })
export class SearchUserPipe implements PipeTransform {
    /**
     * @param {string} value
     * @returns {string}
     * @memberof SearchUserPipe
     */
    transform(items: any[], filterText: any, type: any): any {
        if (type === 'FILTERS_DOUBLE') {
            return items ?
            items.filter(item => (item.name.search(new RegExp(filterText.brand, 'i')) > -1 &&
             item.status.search(new RegExp(filterText.status, 'i')) > -1)) : [];
        }

        if (type === 'STRING') {
            return items ?
                items.filter(item => item.name.search(new RegExp(filterText, 'i')) > -1)
                : [];
        }
    }
}

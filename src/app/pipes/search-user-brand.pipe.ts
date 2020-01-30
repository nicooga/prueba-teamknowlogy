import { PipeTransform, Pipe } from '@angular/core';

/**
 * @export
 * @class SearchUserBrandPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'searchUserBrandPipe' })
export class SearchUserBrandPipe implements PipeTransform {

    constructor(
    ) {}

    /**
     * @param {string} value
     * @returns {string}
     * @memberof SearchUserPipe
     */
    transform(users: any[], filterText: any, type: any): any {
        if (type === 'FILTERS_DOUBLE') {

                return users ? users.filter(item => {
                    return filterText.status === '' ? true :
                    item.status.toString().toUpperCase() === filterText.status.toString().toUpperCase();
                }) : [];
        }

        if (type === 'STRING') {
            return users ?
                users.filter(item => item.username.search(new RegExp(filterText, 'i')) > -1)
                : [];
        }
    }
}

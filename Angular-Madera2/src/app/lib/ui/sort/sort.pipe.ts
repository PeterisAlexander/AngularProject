import { Pipe, PipeTransform } from '@angular/core';
import { sort } from '../../utility/array';

/**
 * Trie une liste en fonction d'une propriété d'un objet (ou d'une liste de propriété en tri cumulatif)
 */
@Pipe({
    name: 'appSort',
})
export class SortPipe implements PipeTransform {
    public transform(
        list: any[],
        property: string | string[] = [],
        isSortAsc = true
    ): any[] {
        if (list == null) {
            return null;
        }

        return sort(list, property, isSortAsc);
    }
}

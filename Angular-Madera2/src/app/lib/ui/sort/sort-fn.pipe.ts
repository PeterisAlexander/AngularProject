import { Pipe, PipeTransform } from '@angular/core';

import { sortFn } from '../../utility/array/sort/sort';

/**
 * Trie une liste grâce à une fonction de comparaison
 */
@Pipe({
    name: 'appSortFn'
})
export class SortFnPipe implements PipeTransform {
    public transform(list: any[], fn: (a: any, b: any) => number): any[] {
        return sortFn(list, fn);
    }
}

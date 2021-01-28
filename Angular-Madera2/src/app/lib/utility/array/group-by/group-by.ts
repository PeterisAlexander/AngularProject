import { isEqual } from 'lodash';
import { getPathValue } from '../../object';
import { GroupingModel } from './grouping.model';

/**
 * Regroupe des items en fonction de la valeur d'une propriété d'un item ou d'un de ses objets imbriqués.
 */
export function groupBy<Item, Value>(
    list: Item[],
    propertyName: string
): GroupingModel<Item, Value>[] {
    return groupByFn<Item, Value>(list, (item) => {
        return getPathValue(item, propertyName);
    });
}

/**
 * Regroupe des items grâce à la valeur que renvoie la fonction passée en paramètre.
 */
export function groupByFn<Item, Value>(list: Item[], fn: (el: Item) => Value) {
    const groups: GroupingModel<Item, Value>[] = [];

    for (const item of list) {
        const value = fn(item);
        let currentGroup = groups.find((g) => isEqual(g.value, value));

        if (currentGroup == null) {
            currentGroup = {
                items: [],
                value,
            };

            groups.push(currentGroup);
        }

        currentGroup.items.push(item);
    }

    return groups;
}

import { isString } from 'lodash';
import { getPathValue } from '../../object';

/**
 * Permet de trier une liste :
 * - par défaut sur l'item de la liste (property = null) => pour les strings et numbers
 * - un tri sur une propriété d'un item (property = string)
 * - un tri cumulatif (property = string[]) : une propriété puis une autre, etc
 *
 * La property accepte un chemin type 'a.b.c' pour descendre dans une grappe d'objet
 */
export function sort<TListType>(
    list: TListType[],
    property: string | string[] = [],
    isSortAsc = true
): TListType[] {
    const properties =
        property == null ? [] : isString(property) ? [property] : property;

    const sorted = sortFn(list, (a, b) =>
        compare(a, b, properties as string[])
    );

    if (!isSortAsc) {
        sorted.reverse();
    }

    return sorted;
}

/**
 * Permet de trier une liste grâce à une fonction de comparaison
 */
export function sortFn<TListType>(
    list: TListType[],
    fn: (a: TListType, b: TListType) => number
): TListType[] {
    return Array.from(list).sort((a, b) => fn(a, b));
}

function compare(a: any, b: any, properties: string[]): number {
    const [property, ...restProperties] = properties;
    const valueA = property ? getPathValue(a, property) : a;
    const valueB = property ? getPathValue(b, property) : b;

    // valeurs null en dernier
    if (valueA == null) {
        return 1;
    }

    if (valueB == null) {
        return -1;
    }

    const result =
        isString(valueA) && isString(valueB)
            ? valueA.localeCompare(valueB)
            : valueA - valueB;

    // tri cumulatif en cas d'égalité
    if (result === 0 && restProperties.length > 0) {
        return compare(a, b, restProperties);
    }

    return result;
}

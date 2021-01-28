import { getPathValue } from '../property-accessor/property-accessor';

/**
 * Retourne si 2 objets sont identiques en comparant leur id
 */
export function compareWithId<TType extends { id: any }>(
    a: TType,
    b: TType
): boolean {
    return compareWithProp(a, b, 'id');
}

/**
 * Retourne vrai si 2 objets sont identiques en comparant la valeur d'une propriété
 */
export function compareWithProp<TType>(
    a: TType,
    b: TType,
    prop: string
): boolean {
    return compareWithFn(a, b, obj => getPathValue(obj, prop));
}

/**
 * Retourne vrai si 2 objets sont identiques en comparant la valeur d'une propriété
 */
export function compareWithPropFactory<TType>(
    prop: string
): (a: TType, b: TType) => boolean {
    return (a: TType, b: TType): boolean => {
        return compareWithProp(a, b, prop);
    };
}

/**
 * Retourne vrai si 2 objets sont identiques en comparant le retour de la fonction passée en paramètre
 */
export function compareWithFn<TType>(
    a: TType,
    b: TType,
    fn: (obj: TType) => any
): boolean {
    if (a == null && b == null) {
        return true;
    }

    return a != null && b != null && fn(a) === fn(b);
}

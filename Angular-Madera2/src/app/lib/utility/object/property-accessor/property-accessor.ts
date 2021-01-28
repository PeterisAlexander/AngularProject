/**
 * Retourne la valeur de la propriété imbriquée dans divers objets à partir d'un chemin
 *
 * ex :
 * const obj = {
 *   a: {
 *     b: {
 *       c: 0
 *     }
 *   }
 * };
 *
 * service.getPathValue(obj, 'a.b.c'); // = 0
 */
export function getPathValue(
    obj: any,
    path: string,
    defaultValue: any = null,
    separator = '.'
): any {
    const propertyNames = path.split(separator);
    const current = propertyNames.shift();

    if (obj == null || current == null) {
        return defaultValue;
    }

    if (propertyNames.length === 0) {
        return obj[current] == null ? defaultValue : obj[current];
    }

    return getPathValue(obj[current], propertyNames.join(separator));
}

/**
 * Assigne la valeur de la propriété imbriquée dans divers objets à partir d'un chemin
 *
 * ex :
 * const obj = {};
 *
 * service.setPathValue(obj, 'a.b.c', 0);
 * // {
 * //   a: {
 * //     b: {
 * //       c: 0
 * //     }
 * //   }
 * // };
 */
export function setPathValue(
    obj: any,
    path: string,
    value: any,
    separator = '.'
): void {
    const propertyNames = path.split(separator);

    const internal = currentObject => {
        const currentPath = propertyNames.shift();

        if (propertyNames.length === 0) {
            currentObject[currentPath] = value;
        } else {
            currentObject[currentPath] =
                currentObject[currentPath] == null
                    ? {}
                    : currentObject[currentPath];

            internal(currentObject[currentPath]);
        }
    };

    if (obj == null) {
        return;
    }

    internal(obj);
}

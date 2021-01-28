/**
 * Permet d'ajouter un slash (/) à la fin d'une chaine de caractères
 */
export function addSlash(value: string): string {
    let result = value;

    if (result[result.length - 1] !== '/') {
        result += '/';
    }

    return result;
}

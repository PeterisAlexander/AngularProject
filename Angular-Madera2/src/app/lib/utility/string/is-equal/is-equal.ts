import { deburr } from 'lodash';
import { IsEqualOption } from './is-equal-option';

/**
 * Configuration des options par défaut de la fonctionnalité
 */
const defaultOptions: IsEqualOption = {
    accentSensitive: true,
    caseSensitive: true,
    spaceSensitive: true,
};

/**
 * Permet de comparer deux chaînes de caractères.
 * Il est possible de spécifier quelques options pour
 * affiner la comparaison.
 */
export function isEqual(
    value1: string,
    value2: string,
    options: IsEqualOption = {}
): boolean {
    let values = [value1, value2];

    options = Object.assign({}, defaultOptions, options);

    if (!options.caseSensitive) {
        values = values.map(formatToLower);
    }

    if (!options.spaceSensitive) {
        values = values.map(formatWhiteSpace);
    }

    if (!options.accentSensitive) {
        values = values.map(formatAccent);
    }

    return values[0] === values[1];
}

/**
 * Permet de formater les espaces multiples
 * de la chaine de caractère en un espace unique
 */
function formatWhiteSpace(value: string): string {
    return value.replace(/\s+/g, ' ');
}

/**
 * Permet de supprimer les accents de la chaine de caractères
 */
function formatAccent(value: string): string {
    return deburr(value);
}

/**
 * Permet de traiter la chaine de caractères en minuscules
 */
function formatToLower(value: string): string {
    return value.toLowerCase();
}

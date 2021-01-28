import { deburr } from 'lodash';

import { ContainsOption } from './contains-option';

/**
 * Configuration des options par défaut de la fonctionnalité
 */
const defaults: ContainsOption = {
    accentSensitive: true,
    caseSensitive: true,
    spaceSensitive: true,
};

/**
 * Test si une chaine (search) est comprise dans une autre chaine (str)
 */
export function contains(
    str: string,
    search: string,
    options: ContainsOption = {}
) {
    let values = [str, search];

    options = { ...defaults, ...options };

    if (!options.caseSensitive) {
        values = values.map(formatToLower);
    }

    if (!options.spaceSensitive) {
        values = values.map(formatWhiteSpace);
    }

    if (!options.accentSensitive) {
        values = values.map(formatAccent);
    }

    [str, search] = values;

    return str.includes(search);
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

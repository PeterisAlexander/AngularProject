import { deburr, escapeRegExp } from 'lodash';
import { HighlightOption } from './highlight-option';
import { sanitizeHtml } from '../sanitize-html/sanitize-html';

/**
 * Configuration des options par défaut de la fonctionnalité
 */
const defaults: HighlightOption = {
    accentSensitive: true,
    caseSensitive: true,
    replacement: '<b>{s}</b>',
};

/**
 * Retourne la chaine (str) avec la chaine recherchée (search) en évidence
 */
export function highlight(
    str: string,
    search: string,
    options: HighlightOption = {}
): string {
    // il faut toujours travailler sur une chaine qui ne contient pas de HTML
    // ne serait-ce que parceque le highlight peut casser la structure HTML (+ sécu, etc)
    str = sanitizeHtml(str, { allowedTags: [] });

    if (str === '' || search === '') {
        return str;
    }

    let values = [str, search];
    options = { ...defaults, ...options };

    if (!options.caseSensitive) {
        values = values.map(formatToLower);
    }

    if (!options.accentSensitive) {
        values = values.map(formatAccent);
    }

    const [newStr, newSearch] = values;
    const index = newStr.search(escapeRegExp(newSearch));

    if (index === -1) {
        return str;
    }

    return [
        str.substring(0, index),
        options.replacement.replace(
            '{s}',
            str.substring(index, index + search.length)
        ),
        str.substring(index + search.length),
    ].join('');
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

/**
 * Description des options de configuration de la fonction highlight
 */
export interface HighlightOption {
    /**
     * Permet de spécifier si la chaine de caractères
     * doit être formatée sans accent
     */
    accentSensitive?: boolean;

    /**
     * Permet de spécifier si la chaine de caractères
     * doit être interprétée en minuscule ou majuscule
     */
    caseSensitive?: boolean;

    /**
     * Permet de spécifier le code html permettant
     * la mise en évidence de la recherche, par défaut :
     * '<b>{s}</b>'
     */
    replacement?: string;
}

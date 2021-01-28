/**
 * Description des options de configuration de la fonction contains
 */
export interface ContainsOption {
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
     * Permet de spécifier si les espaces multiples
     * doivent être supprimés
     */
    spaceSensitive?: boolean;
}

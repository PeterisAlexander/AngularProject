/**
 * Défini la structure de données pour un fichier
 */
export interface CustomFile {
    /**
     * Données du fichier
     */
    content: string;

    /**
     * Nom du fichier
     */
    name: string;

    /**
     * Taille du fichier
     */
    size: number;

    /**
     * Type mime du fichier
     */
    type: string;
}

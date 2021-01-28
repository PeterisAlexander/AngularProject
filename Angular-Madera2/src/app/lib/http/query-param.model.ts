/**
 * Description des paramètres GET autorisés pour effectuer une requête de chargement de données
 */
export interface QueryParamModel {
    /**
     * Paramètre indiquant la liste des éléments à exclure de la liste (id séparés par des ,)
     */
    excludedIds?: any;

    /**
     * Paramètre utilisé pour rechercher dans la liste
     */
    searchValue?: string;

    /**
     * Paramètre indiquant si les éléments archivés sont retournés
     */
    showArchive?: boolean;

    /**
     * Paramètre indiquant si les éléments masqués sont retournés
     */
    showMasque?: boolean;

    /**
     * Paramètre pour la pagination (récupérer à partir de x)
     */
    skip?: number;

    /**
     * Paramètre pour la pagination (récupérer x éléments)
     */
    top?: number;

    /**
     * Tout autre paramètre passé en GET dans l'url
     */
    [param: string]: any;
}

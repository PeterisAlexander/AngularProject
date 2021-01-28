/**
 * Message de réponse pour la demande de suppression d'une ressource
 */
export interface PrepareDeleteResponse {
    /**
     * La ressource peut étre supprimée
     */
    canDelete: boolean;

    [key: string]: boolean;
}

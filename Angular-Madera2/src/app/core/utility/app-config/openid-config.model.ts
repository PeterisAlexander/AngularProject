export interface OpenidConfigModel {
    /**
     * Adrese du server d'autrorité OpenId
     */
    authority: string;

    /**
     * Adresse de base de redirection depuis le serveur d'authorite
     */
    baseRedirectUri: string;

    /**
     * Identfiant unique de l'application client que l'on cherche à authentifier
     */
    clientId: string;

    /**
     * Nom de l'application client que l'on chercher à authentifier
     */
    clientName: string;

    /**
     * Supprimer les claims du protocole de la liste transmise par le client
     */
    filterProtocolClaims: boolean;

    /**
     * Charge les informations du porfile de l'utilisateur
     */
    loadUserInfo: boolean;

    /**
     * Type de réponse attendu en retour
     */
    responseType: string;

    /**
     * Portée de l'authentification liste des scopes séparés par des espaces ex:
     * 'openid profile user'
     */
    scope: string;
}

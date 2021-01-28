export interface MatomoConfigModel {
    /**
     * Active le tracking
     */
    enable: boolean;

    /**
     * Identifiant du portail défini sur le serveur Matomo
     */
    portalSiteId?: number;

    /**
     * Identifiant du site défini sur le serveur Matomo
     */
    siteId?: number;

    /**
     * Url de connexion à l'instance de Matomo
     */
    url: string;
}

/**
 * Interface représentant un organisme de formation récupéré par la WebAPI
 */
export interface OrganismeFormationEntity {
    adresse: string;
    id: number;
    idLogo: string;
    libelle: string;
    matomoSiteId: number;
    timezoneId: string;
    urlClient: string;
    urlWebApi: string;
}

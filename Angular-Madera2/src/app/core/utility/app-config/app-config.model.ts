import { LogEnum } from './log-enum';
import { MatomoConfigModel } from './matomo-config.model';
import { MsalConfigModel } from './msal-config.model';
import { OpenidConfigModel } from './openid-config.model';

export interface AppConfigModel {
    /**
     *  Adresse de l'api web de l'admisistration des comptes utilisateur
     */
    adminstrationWebApiUrl: string;

    /**
     * Permet de désactiver en dev la protection contre la perte de données
     * lorsqu'un utilisateur quitte un formulaire en cours d'édition
     */
    canDeactivateGuard: boolean;

    /**
     * Configuration du fournisseur de géolocalisation
     */
    locationProvider: number;

    /**
     * Niveau de log
     */
    logLevel: LogEnum;

    /**
     * Configuration des accès à Matomo
     */
    matomo: MatomoConfigModel;

    /**
     * Configuration pour la connexion aux services microsoft (Exchange, etc)
     */
    msalConfig: MsalConfigModel;

    /**
     * Configuration OpenId
     */
    openId: OpenidConfigModel;

    /**
     * Adresse d'api web de l'organisme de formation
     */
    organismeWebApiUrl: string;

    /**
     * Adresse de l'application protail
     */
    portalAppUrl: string;
}

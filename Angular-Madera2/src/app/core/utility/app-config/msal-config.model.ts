interface MsalAuthConfigModel {
    /**
     * Identifiant azure de l'application
     *
     * https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/b8b33e8a-0536-48f4-901b-9424588dfad9/isMSAApp/
     */
    clientId: string;

    /**
     * Url de redirection après authentification
     */
    postLogoutRedirectUri: string;

    /**
     * URI acceptée par azure comme destinations lors du renvoi des réponses
     * d'authentification (jetons) après l'authentification des utilisateurs.
     *
     * https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Authentication/appId/b8b33e8a-0536-48f4-901b-9424588dfad9/isMSAApp/
     */
    redirectUri: string;
}

export interface MsalConfigModel {
    auth: MsalAuthConfigModel;
}

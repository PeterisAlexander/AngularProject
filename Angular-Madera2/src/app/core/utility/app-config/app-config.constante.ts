import { InjectionToken } from '@angular/core';
import { AppConfigModel } from './app-config.model';
import { LogEnum } from './log-enum';

export const APP_CONFIG = new InjectionToken<string>('APP_CONFIG');

export const DEFAULT_APP_CONFIG: Readonly<AppConfigModel> = Object.freeze({
    adminstrationWebApiUrl: '',
    canDeactivateGuard: true,
    locationProvider: 1,
    logLevel: LogEnum.none,
    matomo: Object.freeze({
        url: '',
        enable: false,
    }),
    msalConfig: Object.freeze({
        auth: Object.freeze({
            clientId: 'b8b33e8a-0536-48f4-901b-9424588dfad9',
            redirectUri:
                'https://westeros-local.ymag.fr:4200/msal/auth-callback',
            postLogoutRedirectUri: `${window.location.origin}/msal/logout-callback`,
        }),
    }),
    openId: Object.freeze({
        authority: '',
        baseRedirectUri: window.location.origin,
        clientId: 'arya_spa',
        clientName: 'Arya SPA',
        filterProtocolClaims: true,
        loadUserInfo: true,
        responseType: 'id_token token',
        scope: 'openid profile user',
    }),
    organismeWebApiUrl: null,
    portalAppUrl: '',
});

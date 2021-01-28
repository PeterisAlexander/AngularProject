import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetPasswordService } from './end-point/reset-password/reset-password.service';
import { OrganismeOfCompteService } from './end-point/organisme-of-compte/organisme-of-compte.service';
import { ChangePasswordService } from './end-point/change-password/change-password.service';
import { CheckPasswordService } from './end-point/check-password/check-password.service';
import { CurrentOrganismeService } from './end-point/current-organisme/current-organisme.service';
import { AppConfigModel } from '../../utility/app-config/app-config.model';
import { APP_CONFIG } from '../../utility/app-config/app-config.constante';

/**
 * Service pour utiliser l'API Arya administration
 *
 * Pour chaque ressource de 1er niveau accessible sur l'api,
 * il y a une propriété (même nom que le path sur l'api)
 * avec un service / RestCollection en valeur.
 */
@Injectable({
    providedIn: 'root',
})
export class AdministrationAPI {
    public changePassword = new ChangePasswordService(
        `${this._appConfig.adminstrationWebApiUrl}/api/change-password`,
        this._http
    );

    public checkPassword = new CheckPasswordService(
        `${this._appConfig.adminstrationWebApiUrl}/api/check-password`,
        this._http
    );

    public currentOrganisme = new CurrentOrganismeService(
        `${this._appConfig.adminstrationWebApiUrl}/api/organisme/current`,
        this._http
    );

    public organismeOfCompte = new OrganismeOfCompteService(
        `${this._appConfig.adminstrationWebApiUrl}/api/compte-global/organisme-formation`,
        this._http
    );

    public resetPassword = new ResetPasswordService(
        `${this._appConfig.adminstrationWebApiUrl}/api/reset-password`,
        this._http
    );

    public constructor(
        @Inject(APP_CONFIG)
        private _appConfig: AppConfigModel,
        private _http: HttpClient
    ) {}
}

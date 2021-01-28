import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResetPasswordEntity } from 'src/app/core/entity/authentification/reset-password-entity';
import { PrepareResetPasswordEntity } from 'src/app/core/entity/authentification/prepare-reset-password.entity';
import { PrepareResetPasswordRequest } from './prepare-reset-password-request';
import { ResetPasswordRequest } from './reset-password-request';
import { ReinitPasswordRequest } from './reinit-password-request';
import { ReinitPasswordEntity } from 'src/app/core/entity/authentification/reinit-password.entity';

const jsonHeaders = {
    'Content-Type': 'application/json',
};

export class ResetPasswordService {
    public constructor(private _path: string, private _http: HttpClient) {}

    /**
     * Méthode pour préparation au reset du password
     */
    public prepare(
        data: PrepareResetPasswordRequest
    ): Observable<PrepareResetPasswordEntity> {
        return this._http.post<PrepareResetPasswordEntity>(
            `${this._path}/prepare`,
            data,
            {
                headers: jsonHeaders,
            }
        );
    }

    /**
     * Effectue une demande de réinitialisation du mot de passe de l'utilisateur
     */
    public request(
        data: ReinitPasswordRequest
    ): Observable<ReinitPasswordEntity> {
        return this._http.post<ReinitPasswordEntity>(
            `${this._path}/request`,
            data,
            {
                headers: jsonHeaders,
            }
        );
    }

    /**
     * Met à jour le mot de passe de l'utilisateur
     */
    public reset(data: ResetPasswordRequest): Observable<ResetPasswordEntity> {
        return this._http.post<ResetPasswordEntity>(this._path, data, {
            headers: jsonHeaders,
        });
    }
}

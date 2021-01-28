import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordRequest } from './change-password-request';

const jsonHeader = new HttpHeaders({
    'Content-type': 'application/json',
});

export class ChangePasswordService {
    public constructor(private _path: string, private _http: HttpClient) {}

    /**
     * Met à jour le password de l'utilisateur avec le mot de passe envoyé
     */
    public change(message: ChangePasswordRequest): Observable<void> {
        return this._http.post<void>(this._path, message, {
            headers: jsonHeader,
        });
    }
}

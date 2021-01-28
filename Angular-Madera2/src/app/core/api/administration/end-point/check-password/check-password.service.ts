import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckPasswordRequest } from './check-password-request';
import { map } from 'rxjs/operators';

const jsonHeader = new HttpHeaders({
    'Content-type': 'application/json',
});

export class CheckPasswordService {
    public constructor(private _path: string, private _http: HttpClient) {}

    /**
     * Vérifie si le password envoyé est celui de l'utilisateur courant
     */
    public check(message: CheckPasswordRequest): Observable<boolean> {
        return this._http
            .post<{ isValid: boolean }>(this._path, message, {
                headers: jsonHeader,
            })
            .pipe(map((r) => r.isValid));
    }
}

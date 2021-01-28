import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeleteResponse } from './delete.response';

const jsonHeader = new HttpHeaders({
    'Content-Type': 'application/json',
});

/**
 * Représente une ressource accessible à partir d'une API rest.
 *
 * ex : /api/personne/1 => personne avec l'identifiant 1
 * On peut la récupérer, la mettre à jour, la supprimer
 *
 * Description des types :
 * - TEntity : Entité retournée lors d'un get ou d'un update
 * - TUpdate : Message permettant la mise à jour de la ressource
 */
export class RestRessource<TEntity, TUpdate, TDeleteResponse = DeleteResponse> {
    private get _basePath(): string {
        if (this._id == null) {
            return this._path;
        }

        return `${this._path}/${this._id}`;
    }

    public constructor(
        protected _path: string,
        protected _id: number,
        protected _http: HttpClient
    ) {}

    /**
     * Suppression de la ressource
     */
    public delete(): Observable<TDeleteResponse> {
        return this._http.delete<TDeleteResponse>(this._basePath);
    }

    /**
     * Récupération de la ressource
     */
    public get(): Observable<TEntity> {
        return this._http.get<TEntity>(this._basePath);
    }

    /**
     * Mise à jour de la ressource
     */
    public update(request: TUpdate): Observable<TEntity> {
        return this._http.put<TEntity>(this._basePath, request, {
            headers: jsonHeader,
        });
    }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Type } from '@angular/core';
import { Observable } from 'rxjs';

const jsonHeader = new HttpHeaders({
    'Content-Type': 'application/json'
});

/**
 * Représente une liste de ressources accessible à partir d'une API rest.
 *
 * ex : /api/personne => liste de personnes
 * On peut la récupérer, ajouter un élément, mettre à jour la liste complète
 *
 * Description des types :
 * - TResource : Classe permettant de gérer un item de liste, ex : PersonneRestResource
 * - TEntity : Entité retournée lors d'un getAll ou d'un update
 * - TCreate : Message permettant la création d'une ressource
 * - TUpdate : Message permettant la mise à jour de la liste de ressources
 */
export class RestCollection<TResource, TEntity, TCreate, TUpdate> {
    public constructor(
        protected _path: string,
        protected _http: HttpClient,
        /**
         * Classe permettant de gérer un item de la liste de ressource
         */
        protected _restResource: Type<TResource>
    ) {
        // permet à la fonction getAll d'être passée en paramètre d'un listLoader sans la binder
        this.getAll = this.getAll.bind(this);
    }

    /**
     * Permet de travailler avec un item de la liste de ressources à partir de son identifiant
     */
    public byId(id: number | string): TResource {
        return new this._restResource(this._path, id, this._http);
    }

    /**
     * Créé une nouvelle ressource
     */
    public create(request: TCreate): Observable<TEntity> {
        return this._http.post<TEntity>(this._path, request, {
            headers: jsonHeader
        });
    }

    /**
     * Retourne une liste de ressources
     */
    public getAll(params = new HttpParams()): Observable<TEntity[]> {
        return this._http.get<TEntity[]>(this._path, { params: params });
    }

    /**
     * Met à jour la liste de ressources
     */
    public update(request: TUpdate): Observable<TEntity[]> {
        return this._http.put<TEntity[]>(this._path, request, {
            headers: jsonHeader
        });
    }
}

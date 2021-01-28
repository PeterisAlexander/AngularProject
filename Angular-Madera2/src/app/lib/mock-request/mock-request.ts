import { PrepareDeleteResponse } from 'src/app/core/api/business/end-point/commun/prepare-delete-response';
import { Injectable } from '@angular/core';

/**
 * Base pour réaliser une classe simulant une Web API avec une structure de données et des points d'accès
 */
@Injectable()
export abstract class MockRequest {
    /**
     * Nom de la propriété permettant d'accéder à l'identifant d'une ligne
     */
    protected _idAccessor = 'id';

    /**
     * Base de données
     */
    private _db: { [table: string]: any[] } = {};

    /**
     * Points d'accès à la Web API
     */
    private _endPoints: { [endPoint: string]: Function } = {};

    public constructor() {
        this._db = this.createDB();
        this._endPoints = this.createEndPoints();
    }

    /**
     * Ajout d'une ligne dans une table
     */
    public add(table: string, data: any): number {
        if (this._db[table] == null) {
            this._db[table] = [];
        }

        const nextId =
            this._db[table].length === 0
                ? 1
                : this._db[table][this._db[table].length - 1][
                      this._idAccessor
                  ] + 1;

        data[this._idAccessor] = nextId;
        this._db[table].push(data);

        return nextId;
    }

    /**
     * Créer la base de données de la Web API
     */
    public abstract createDB(): { [table: string]: any[] };

    /**
     * Créer les points d'accès de la Web API
     */
    public abstract createEndPoints(): { [endPoint: string]: Function };

    /**
     * Suppression d'une ligne d'une table
     */
    public delete(table: string, id: number): void {
        if (this._db[table] == null || this._db[table].length === 0) {
            return;
        }

        this._db[table] = this._db[table].filter(
            (e) => e[this._idAccessor] !== id
        );
    }

    /**
     * Retourne une ligne d'une table via son id
     */
    public get(table: string, id: number): any {
        return (this._db[table] || []).find((e) => e[this._idAccessor] === id);
    }

    /**
     * Retourne toutes les lignes d'une table
     */
    public getAll(table: string): any[] {
        return this._db[table] || [];
    }

    /**
     * Retourne le point d'accès à la Web API en fonction de l'url
     */
    public getEndPoint(
        method: string,
        url: string
    ): (requestBody: any) => Function {
        const endPoint = Object.keys(this._endPoints).find(
            (currentEndPoint) => {
                const [
                    currentEndPointMethod,
                    currentEndPointUrl,
                ] = currentEndPoint.split(' ');

                if (
                    currentEndPointMethod.toUpperCase() !== method.toUpperCase()
                ) {
                    return false;
                }

                return this.endPointUrlToRegExp(currentEndPointUrl).test(url);
            }
        );

        if (endPoint == null) {
            return null;
        }

        const [endPointMethod, endPointUrl] = endPoint.split(' ');

        return (requestBody) => {
            const params = this.getEndPointParams(endPointUrl, url);

            if (['POST', 'PUT'].includes(endPointMethod.toLocaleUpperCase())) {
                params.push(requestBody);
            }

            return this._endPoints[endPoint].apply(null, params);
        };
    }

    /**
     * Indique si une ligne peut être supprimé.
     * Comme il est impossible de le mocké correctement en raison que cela résulte de règle métier.
     * Il faudra transmettre la réponse voulut au mock (sous form d'un boolean en paramètre).
     */
    public prepareDelete(canDeleted: boolean): PrepareDeleteResponse {
        const prepareDeleteResponse: PrepareDeleteResponse = {
            canDelete: canDeleted,
        };

        return prepareDeleteResponse;
    }

    /**
     * Mise à jour d'une ligne d'une table
     */
    public update(table: string, id: number, data: any): boolean {
        let current = this.get(table, id);

        if (current == null) {
            id = this.add(table, data);
            current = this.get(table, id);
        }

        Object.assign(current, data);

        return true;
    }

    /**
     * Transforme le pattern de l'url du point d'accès en RegExp
     */
    private endPointUrlToRegExp(url: string): RegExp {
        const str = url
            .replace(/\//g, '\\/')
            .replace(/\{\w+\}/g, '([\\w,\\d]+)');

        return new RegExp(`^.*${str}$`);
    }

    /**
     * Retourne les paramètres d'un point d'accès à partir d'une url
     */
    private getEndPointParams(
        endPointUrl: string,
        url: string
    ): Array<string | number> {
        const isInt = /\d+/;

        return url
            .match(this.endPointUrlToRegExp(endPointUrl))
            .slice(1)
            .map((current) =>
                isInt.test(current) ? parseInt(current, 10) : current
            );
    }
}

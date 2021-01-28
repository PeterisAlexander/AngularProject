import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';

/**
 * Service pour utiliser l'API Arya business
 *
 * Pour chaque ressource de 1er niveau accessible sur l'api,
 * il y a une propriété (même nom que le path sur l'api)
 * avec un service / RestCollection en valeur.
 */
@Injectable({
  providedIn: 'root',
})
export class BusinessAPI implements HandlePropertyChange {
  /** Exemple de récupération de donnée via a une api
   * public get typePersonne(): TypePersonneRestCollection {
   *      return this.getEndPoint(
   *          TypePersonneRestCollection,
   *          '/api/type-personne'
   *      );
   * }
   */

  @ListenPropertyChange()
  public url: string;

  private _endPointCache = new Map();

  public constructor(private _http: HttpClient) {}

  public handlePropertyChange(changes: ChangeByPropertyModel): void {
    if (changes.url) {
      this._endPointCache.clear();
    }
  }

  private getEndPoint<EndPoint>(
    endPoint: Type<EndPoint>,
    path: string,
    additionalParams: any[] = []
  ): EndPoint {
    if (!this._endPointCache.has(endPoint)) {
      this._endPointCache.set(
        endPoint,
        new endPoint(`${this.url}${path}`, this._http, ...additionalParams)
      );
    }

    return this._endPointCache.get(endPoint);
  }
}

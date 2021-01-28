import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Signature de la fonction permettant de récupérer les données
 */
export type DataFetcher<Item> = (params: HttpParams) => Observable<Item[]>;

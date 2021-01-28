import { Params } from '@angular/router';

/**
 * Définition d'une route pour une utilisation via un [routerLink]
 */
export interface RouteModel {
    /**
     * Chemin de la route, pas de typage plus strict,
     * c'est ce que demande la méthode la propriété routerLink
     * https://angular.io/api/router/RouterLink
     */
    path: string | any[];
    queryParams?: Params;
}

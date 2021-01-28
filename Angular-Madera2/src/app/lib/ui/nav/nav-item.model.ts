import { RouteModel } from '../../model/route.model';

export interface NavItemModel {
    children?: NavItemModel[];
    description?: string;
    hidden?: boolean;
    icon?: string;
    label: string;
    route?: RouteModel;
    /**
     * Permet de vérifier si une url correspond à l'item de navigation sans tester la route exacte
     * exemple :
     * - route : { path: '/ressource/1' }
     * - routePattern : '/ressource/:idRessource'
     *
     * L'item doit pouvoir être considérer actif quelque soit la valeur de :idRessource.
     */
    routePattern?: string;
}

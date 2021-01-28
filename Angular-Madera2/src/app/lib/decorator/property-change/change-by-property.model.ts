import { ChangeModel } from './change.model';

/**
 * Regroupement des propriétés d'une classe (suivies via le décorateur
 * @ListenPropertyChange) et qui ont changées de valeur.
 */
export interface ChangeByPropertyModel {
    [property: string]: ChangeModel;
}

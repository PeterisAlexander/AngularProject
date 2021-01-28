import { ChangeByPropertyModel } from './change-by-property.model';

/**
 * Interface permettant de définir la méthode qui sera exécutée
 * à chaque changement des propriétés d'une classe
 * via la décorateur @ListenPropertyChange.
 */
export interface HandlePropertyChange {
    handlePropertyChange: (changes: ChangeByPropertyModel) => void;
}

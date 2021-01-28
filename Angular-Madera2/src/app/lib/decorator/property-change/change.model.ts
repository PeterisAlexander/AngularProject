/**
 * Description d'un changement de valeur d'une propriété suivie
 * via le décorateur @ListenPropertyChange.
 */
export interface ChangeModel {
    currentValue: any;
    previousValue?: any;
}

import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { CurrencyPipe as NgCurrencyPipe } from '@angular/common';

/**
 * Pipe permettant d'indiquer à Angular la devise à utiliser
 * en fonction du langage utilisé dans l'application
 */
@Pipe({
    name: 'appCurrency',
})
export class CurrencyPipe implements PipeTransform {
    public constructor(
        /**
         * Valeur de la constante de localisation
         */
        @Inject(LOCALE_ID) private _locale: string
    ) {}

    /**
     * Renvoi la devise à utiliser
     */
    public transform(value: string): string {
        const currency = new NgCurrencyPipe(this._locale);
        let result: string;

        switch (this._locale) {
            case 'fr':
            case 'fr-FR':
                result = currency.transform(value, 'EUR');
                break;

            default:
                result = currency.transform(value, 'USD');
                break;
        }

        return result;
    }
}

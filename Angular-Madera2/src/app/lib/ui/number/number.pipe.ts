import { PipeTransform, Pipe, Inject, LOCALE_ID } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * Pipe permettant de formater un nombre
 */
@Pipe({
    name: 'appNumber',
})
export class NumberPipe implements PipeTransform {
    public constructor(
        /**
         * Valeur de la constante de localisation
         */
        @Inject(LOCALE_ID) private _locale: string
    ) {}

    /**
     * Renvoie la valeur formatée.
     * Le paramètres digitsInfo représente les options des décimaux.
     * Format : {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
     * - minIntegerDigits: Nombre minimum de chiffres avant la virgule. Par défaut 1.
     * - minFractionDigits: Nombre minimum de chiffres après la virgule. Par défaut 0.
     * - maxFractionDigits: Nombre maximun de chiffres après la virgule.
     */
    public transform(value: string | number, digitsInfo?: string): string {
        const decimalPipe = new DecimalPipe(this._locale);
        return decimalPipe.transform(value, digitsInfo);
    }
}

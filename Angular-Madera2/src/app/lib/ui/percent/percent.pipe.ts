import { PipeTransform, Pipe, Inject, LOCALE_ID } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * Pipe permettant de formater un pourcentage
 */
@Pipe({
    name: 'appPercent',
})
export class PercentPipe implements PipeTransform {
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
    public transform(value: string, digitsInfo?: string): string {
        if (value === null || value === undefined) {
            return '';
        }

        const decimalPipe = new DecimalPipe(this._locale);
        return `${decimalPipe.transform(value, digitsInfo)} %`;
    }
}

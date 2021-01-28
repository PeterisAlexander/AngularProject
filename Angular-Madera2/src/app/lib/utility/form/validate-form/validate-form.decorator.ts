import { AbstractControl } from '@angular/forms';
import { validateForm } from './validate-form';

/**
 * Décorateur permettant de forcer l'affichage des erreurs sur un formulaire.
 * A mettre par exemple sur une méthode submit :
 *
 * @ValidationForm('form')
 * public submit(): void {
 *     ...
 * }
 *
 * Le paramètre emitEvent permet de savoir si les événements valueChanges et statusChanges
 * des AbstractControl doivent être déclenchés
 */
export function ValidateForm(formName: string, emitEvent = true) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod: Function = descriptor.value;

        // Retourne :
        // - false en cas d'erreur de validation
        // - void si tout va bien
        descriptor.value = function(this: any, ...args: any[]): false | void {
            if (validateForm(this[formName] as AbstractControl, emitEvent)) {
                return originalMethod.apply(this, args);
            }

            return false;
        };

        return descriptor;
    };
}

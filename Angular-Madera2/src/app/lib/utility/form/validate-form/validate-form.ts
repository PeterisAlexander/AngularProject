import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

/**
 * Utilitaire permettant de forcer l'affichage des erreurs sur un formulaire.
 *
 * Le paramètre emitEvent permet de savoir si les événements valueChanges et statusChanges
 * des AbstractControl doivent être déclenchés
 *
 * La fonction retourne false s'il y a une erreur de validation
 */
export function validateForm(form: AbstractControl, emitEvent = true): boolean {
    return internal(form, emitEvent);
}

function internal(control: AbstractControl, emitEvent: boolean): boolean {
    if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ emitEvent: emitEvent });
    }

    if (control instanceof FormArray) {
        return (
            (control.valid || control.disabled) &&
            control.controls
                .map(c => internal(c, emitEvent))
                .every(isOk => isOk)
        );
    }

    if (control instanceof FormGroup) {
        return (
            control.disabled ||
            (Object.keys(control.controls)
                .map(c => internal(control.controls[c], emitEvent))
                .every(isOk => isOk) &&
                control.valid)
        );
    }

    return control.valid || control.disabled;
}

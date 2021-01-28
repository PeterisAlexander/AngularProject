import { FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { isString } from 'lodash';

/**
 * Retourne la valeur du formulaire ou la valeur d'un champ du formulaire suivant son chemin.
 * Contrairement à la propriété value du reactive form, les champs désactivés
 * seront valorisés (au lieu d'être undefined).
 */
export function getFormValue<TValue>(
    form: AbstractControl,
    pathToValue?: string
): TValue {
    if (isString(pathToValue)) {
        return getControlValue(form.get(pathToValue));
    }

    return getControlValue(form);
}

/**
 * Retourne la valeur du control.
 */
function getControlValue(control: AbstractControl): any {
    if (control instanceof FormArray) {
        return control.controls.map(c => getControlValue(c));
    }

    if (control instanceof FormGroup) {
        const value = {};

        Object.keys(control.controls).forEach(controlName => {
            value[controlName] = getControlValue(control.controls[controlName]);
        });

        return value;
    }

    return control.value;
}

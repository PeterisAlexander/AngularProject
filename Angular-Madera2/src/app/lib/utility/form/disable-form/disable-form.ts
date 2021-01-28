import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { flatten } from 'lodash';

const deactivatedControls = new Map<AbstractControl, AbstractControl[]>();

/**
 * Désactive tous les champs du formulaire
 */
export function disableForm(form: FormGroup | FormArray): void {
    // mémorise les champs désactivés afin de ne pas les réactiver
    // via la fonction enableForm
    deactivatedControls.set(form, getDeactivatedControls(form));

    // la fonction disableForm est initialement prévue pour désactiver
    // le formulaire lors de la soumission de celui-ci. Il ne faut pas
    // déclencher d'événement sous peine de déclencher des traitements
    // via des écouteurs sur l'événement valueChange des champs du formulaire.
    form.disable({ emitEvent: false });
}

/**
 * Active les champs du formulaire, si ce dernier a été désactivé via
 * la fonction disableForm, les champs qui étaient à l'origine désactivés
 * le resteront
 */
export function enableForm(form: FormGroup | FormArray): void {
    // la fonction enableForm est initialement prévue pour ré activer
    // le formulaire après soumission de celui-ci. Il ne faut pas
    // déclencher d'événement sous peine de déclencher des traitements
    // via des écouteurs sur l'événement valueChange des champs du formulaire.
    form.enable({ emitEvent: false });

    if (!deactivatedControls.has(form)) {
        return;
    }

    deactivatedControls.get(form).forEach((control) => {
        control.disable({
            emitEvent: false,
            onlySelf: true,
        });
    });

    deactivatedControls.delete(form);
}

/**
 * Retourne les champs désactivés du formulaire
 */
function getDeactivatedControls(control: AbstractControl): AbstractControl[] {
    let controls = [];

    if (control instanceof FormArray) {
        controls = [
            ...controls,
            ...flatten(control.controls.map((c) => getDeactivatedControls(c))),
        ];
    }

    if (control instanceof FormGroup) {
        controls = [
            ...controls,
            ...flatten(
                Object.keys(control.controls).map((c) =>
                    getDeactivatedControls(control.controls[c])
                )
            ),
        ];
    }

    if (control.disabled) {
        controls = [...controls, control];
    }

    return controls;
}

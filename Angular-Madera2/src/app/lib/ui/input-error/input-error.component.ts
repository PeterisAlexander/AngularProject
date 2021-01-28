import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isFunction } from 'lodash';

export interface InputErrorModel {
    [error: string]: string | ((error: any) => string);
}

type ControlErrorModel = [string, any];

const defaultErrors: InputErrorModel = {
    required: 'Ce champ est requis',
    some: 'Au moins une réponse est requise',
    min: (error) => `La valeur doit être supérieur ou égale à ${error.min}`,
    max: (error) => `La valeur doit être inférieur ou égale à ${error.max}`,
    maxlength: (error) =>
        `Ce champ ne doit pas contenir plus de ${
            error.requiredLength
        } caractère${error.requiredLength === 1 ? '' : 's'}`,
    minlength: (error) =>
        `Ce champ doit contenir au moins ${error.requiredLength} caractère${
            error.requiredLength === 1 ? '' : 's'
        }`,
    pattern: 'Format incorrect',
    email: `Format d'adresse mail incorrect`,
    controlEqual: 'Champs non identiques',
    controlDifferent: 'Champs identiques',
    lowerThan: (error) => {
        return error.isDate
            ? 'Doit être inférieure ' +
                  (error.canBeEqual ? 'ou égale ' : '') +
                  'à la date de fin'
            : 'Doit être inférieure' + (error.canBeEqual ? ' ou égale' : '');
    },
    greaterThan: (error) => {
        return error.isDate
            ? 'Doit être supérieure ' +
                  (error.canBeEqual ? 'ou égale ' : '') +
                  'à la date de début'
            : 'Doit être supérieure' + (error.canBeEqual ? ' ou égale' : '');
    },
    invalidRange: "L'heure de fin doit être après l'heure de début.",
    overlap:
        'Vous ne pouvez créer une séance à ces horaires car elle en chevauche une autre.',
};

/**
 * Composant permettant l'affichage des erreurs des inputs suite validation
 */
@Component({
    selector: 'app-input-error',
    templateUrl: './input-error.component.html',
    styleUrls: ['./input-error.component.css'],
})
export class InputErrorComponent {
    /**
     * Champ de formulaire avec validation
     */
    @Input()
    public control: AbstractControl;

    @Input()
    public get customErrors(): InputErrorModel {
        return this._customErrors;
    }

    public set customErrors(errors: InputErrorModel) {
        this._customErrors = { ...defaultErrors, ...errors };
    }

    public get controlErrors(): ControlErrorModel[] {
        return Object.entries(this.control?.errors || this.errors || {});
    }

    @Input()
    public errors: ValidationErrors;

    public isFunction = isFunction;

    private _customErrors = { ...defaultErrors };

    public trackByError(index: number, error: ControlErrorModel): string {
        return error[0];
    }
}

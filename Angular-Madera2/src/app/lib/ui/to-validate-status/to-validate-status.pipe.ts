import { PipeTransform, Pipe } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Transforme le status d'un AbstractControl en status compréhensible pour le NzFormControl
 */
@Pipe({
    name: 'appToValidateStatus',
    pure: false
})
export class ToValidateStatusPipe implements PipeTransform {
    public transform(value: AbstractControl): string {
        if (value.pristine) {
            return null;
        }

        if (value.status === 'INVALID') {
            return 'error';
        }

        if (value.status === 'PENDING') {
            return 'validating';
        }

        if (value.status === 'VALID') {
            return 'success';
        }

        return null;
    }
}

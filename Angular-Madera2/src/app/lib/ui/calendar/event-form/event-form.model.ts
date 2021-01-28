import {
    ValidatorFn,
    AsyncValidatorFn,
    FormControl,
    Validators,
    FormGroup
} from '@angular/forms';

export function eventFormFactory(
    validators: ValidatorFn[] = [],
    asyncValidators: AsyncValidatorFn[] = []
): FormGroup {
    return new FormGroup({
        dates: new FormGroup(
            {
                dateStart: new FormControl(null, Validators.required),
                dateEnd: new FormControl(null, Validators.required)
            },
            {
                validators,
                asyncValidators,
                updateOn: 'blur'
            }
        ),
        description: new FormControl(null)
    });
}

export interface EventFormModel {
    dates: {
        dateEnd: Date;
        dateStart: Date;
    };
    description: string;
}

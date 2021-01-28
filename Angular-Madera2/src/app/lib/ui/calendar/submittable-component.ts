import { FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';

export interface SubmittableComponent {
    form: FormGroup;
    save: EventEmitter<any>;
    submit(): void | boolean;
}

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validateForm } from './validate-form';

describe('validateForm', () => {
    let form: FormGroup;

    beforeEach(() => {
        form = new FormGroup({
            control: new FormControl(null, [Validators.required])
        });
    });

    it(`validateForm doit forcer l'affichage des des champs en erreurs`, () => {
        expect(form.get('control').invalid).toBeTruthy();
        expect(validateForm(form)).toBeFalsy();
        expect(form.get('control').dirty).toBeTruthy();
    });
});

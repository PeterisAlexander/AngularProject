import { FormGroup, FormControl } from '@angular/forms';
import { disableForm, enableForm } from './disable-form';

describe('disable & enable form', () => {
    let form: FormGroup;

    beforeEach(() => {
        form = new FormGroup({
            enabled: new FormControl(1),
            disabled: new FormControl(2)
        });

        form.controls.disabled.disable();
    });

    it('disableForm désactive tous les champs du formulaire', () => {
        disableForm(form);

        expect(form.controls.enabled.disabled).toBeTruthy();
        expect(form.controls.disabled.disabled).toBeTruthy();
    });

    it('enableForm active tous les champs du formulaire qui étaient activés avant désactivation du formulaire', () => {
        disableForm(form);
        enableForm(form);

        expect(form.controls.enabled.enabled).toBeTruthy();
        expect(form.controls.disabled.disabled).toBeTruthy();
    });
});

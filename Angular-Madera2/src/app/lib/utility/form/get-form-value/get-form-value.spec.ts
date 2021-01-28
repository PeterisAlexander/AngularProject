import { FormGroup, FormControl } from '@angular/forms';

describe('getFormValue', () => {
    let form: FormGroup;

    beforeEach(() => {
        form = new FormGroup({
            enabled: new FormControl(1),
            disabled: new FormControl(2)
        });

        form.controls.disabled.disable();
    });

    it(`getFormValue retourne la valeur d'un formulaire même des champs désactivés`, () => {
        expect(form.controls.enabled.value).toEqual(1);
        expect(form.controls.disabled.value).toEqual(2);
    });
});

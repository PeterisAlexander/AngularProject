import { TestBed } from '@angular/core/testing';
import { ToValidateStatusPipe } from './to-validate-status.pipe';
import { FormControl } from '@angular/forms';

describe('ToValidateStatusPipe', () => {
    let pipe: ToValidateStatusPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToValidateStatusPipe]
        });

        pipe = TestBed.inject(ToValidateStatusPipe);
    });

    it('doit créer une instance', () => {
        expect(pipe).toBeTruthy();
    });

    it(`transform convertis le statut d'un AbstractControl en statut pour les NzFormControl`, () => {
        const control = new FormControl(null);

        expect(pipe.transform(control)).toEqual(null);
        control.markAsDirty();
        expect(pipe.transform(control)).toEqual('success');
    });
});

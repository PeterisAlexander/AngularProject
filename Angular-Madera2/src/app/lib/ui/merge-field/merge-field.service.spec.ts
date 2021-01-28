import { TestBed } from '@angular/core/testing';
import { MergeFieldInputModel, MergeFieldService } from './merge-field.service';
import { v4 as generateUuid } from 'uuid';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { delay } from 'lodash';

describe('MergeFieldService', () => {
    let service: MergeFieldService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MergeFieldService);
    });

    it('dois être créé', () => {
        expect(service).toBeTruthy();
    });

    it('dois pouvoir ajouter un input', () => {
        const input: MergeFieldInputModel = {
            id: generateUuid(),
            focus: of<void>(),
            insert: (key, isMail) => {},
        };

        service.addInput(input);

        expect(service.hasInput(input.id)).toBeTruthy();
    });

    it('dois pouvoir retirer un input', () => {
        const input: MergeFieldInputModel = {
            id: generateUuid(),
            focus: of<void>(),
            insert: (key, isMail) => {},
        };

        service.addInput(input);

        expect(service.hasInput(input.id)).toBeTruthy();

        service.removeInput(input.id);

        expect(service.hasInput(input.id)).toBeFalsy();
    });

    it("doit définir l'input actif en cas d'émission sur l'orbservable focus", (done) => {
        const input: MergeFieldInputModel = {
            id: generateUuid(),
            focus: new Observable((sub) => {
                delay(() => sub.next(), 0);
            }),
            insert: (key, isMail) => {},
        };

        service.addInput(input);

        delay(() => {
            expect(service.activeInput).toBeTruthy();

            done();
            service.removeInput(input.id);
        }, 500);
    });

    it("appeler la méthode insert du service doit appeler la méthode insert de l'input actif", (done) => {
        const formControl = new FormControl('');

        const input: MergeFieldInputModel = {
            id: generateUuid(),
            focus: new Observable((sub) => {
                delay(() => sub.next(), 0);
            }),
            insert: (key, isMail) => {
                formControl.patchValue(formControl.value + `{{ ${key} }}`);
            },
        };

        service.addInput(input);

        delay(() => {
            service.insert('key');
        }, 500);

        delay(() => {
            expect(formControl.value).toEqual('{{ key }}');
            done();
            service.removeInput(input.id);
        }, 1000);
    });
});

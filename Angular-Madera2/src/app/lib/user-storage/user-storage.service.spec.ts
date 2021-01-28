import { TestBed, inject } from '@angular/core/testing';

import { UserStorageService } from './user-storage.service';

describe('UserStorageService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserStorageService],
        });
    });

    afterEach(() => {
        // suppression des tests du localstorage
        localStorage.clear();
    });

    it('doit se créer', inject(
        [UserStorageService],
        (service: UserStorageService) => {
            expect(service).toBeTruthy();
        }
    ));

    it('get(key) doit retourner la valeur de la clé', inject(
        [UserStorageService],
        (service: UserStorageService) => {
            service.set('test', true);
            expect(service.get('test')).toBeTruthy();
            expect(service.get('unknow')).toBeNull();
        }
    ));

    it('set(key, value) doit sauvegarder la valeur pour la clé', inject(
        [UserStorageService],
        (service: UserStorageService) => {
            expect(service.get('test')).toBeNull();
            service.set('test', true);
            expect(service.get('test')).toBeTruthy();
        }
    ));

    it('has(key) doit retourner true si la clé est présente', inject(
        [UserStorageService],
        (service: UserStorageService) => {
            expect(service.has('test')).toBeFalsy();
            service.set('test', true);
            expect(service.has('test')).toBeTruthy();
        }
    ));

    it('remove(key) doit supprimer la clé et sa valeur du stockage', inject(
        [UserStorageService],
        (service: UserStorageService) => {
            service.set('test', true);
            expect(service.has('test')).toBeTruthy();
            service.remove('test');
            expect(service.has('test')).toBeFalsy();
        }
    ));

    it('removeAll() doit supprimer toutes les clés et leur valeur du stockage', inject(
        [UserStorageService],
        (service: UserStorageService) => {
            service.set('test', true);
            service.set('test2', true);
            expect(service.has('test')).toBeTruthy();
            expect(service.has('test2')).toBeTruthy();
            service.removeAll();
            expect(service.has('test')).toBeFalsy();
            expect(service.has('test2')).toBeFalsy();
        }
    ));
});

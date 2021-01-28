import { TestBed, inject } from '@angular/core/testing';

import { BrowserLocationService } from './browser-location.service';

describe('BrowserLocationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BrowserLocationService],
        });
    });

    it('doit se créer', inject(
        [BrowserLocationService],
        (service: BrowserLocationService) => {
            expect(service).toBeTruthy();
        }
    ));

    it(`getOrigin() doit retourner la partie origine de l'url courante `, inject(
        [BrowserLocationService],
        (service: BrowserLocationService) => {
            expect(service.getOrigin()).toBe(window.location.origin);
        }
    ));
});

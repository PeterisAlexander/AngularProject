import { inject, TestBed } from '@angular/core/testing';
import { CustomFileService } from './custom-file.service';

describe('CustomFileService', () => {
    let service: CustomFileService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CustomFileService]
        });

        service = TestBed.inject(CustomFileService);
    });

    it('peut être créé', () => {
        expect(service).toBeTruthy();
    });

    it(`doit retourner un CustomFile valide à partir d'une chaine`, inject(
        [],
        () => {
            const file = service.createFromString('data:image/png;base64,');
            expect(file.type === 'image/png').toBeTruthy();
        }
    ));
});

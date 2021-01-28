import { TestBed } from '@angular/core/testing';

import { AvatarInitialePipe } from './avatar-initiale.pipe';

describe('AvatarInitialePipe', () => {
    let pipe: AvatarInitialePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AvatarInitialePipe]
        });

        pipe = TestBed.inject(AvatarInitialePipe);
    });

    it('Doit être créé', () => {
        expect(pipe).toBeTruthy();
    });

    it('doit retourner les initiale de la personne', () => {
        const initiales = pipe.transform(
            {
                prenom: 'Jon',
                nom: 'Snow'
            },
            'nom',
            'prenom'
        );

        expect(initiales).toBe('SJ');
    });
});

import { AvatarUrlPipe } from './avatar-url.pipe';
import { TestBed } from '@angular/core/testing';

import { MediaImageService } from 'src/app/core/service/media/media-image.service';
import { UserStorageService } from 'src/app/lib/user-storage/user-storage.service';
import {
    APP_CONFIG,
    DEFAULT_APP_CONFIG,
} from 'src/app/core/utility/app-config/app-config.constante';

describe('AvatarUrlPipe', () => {
    let pipe: AvatarUrlPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MediaImageService,
                UserStorageService,
                AvatarUrlPipe,
                { provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG },
            ],
        });

        pipe = TestBed.inject(AvatarUrlPipe);
    });

    it('Doit être créé', () => {
        expect(pipe).toBeTruthy();
    });

    it(`doit retourner l'url d'acces à l'image de l'avatar en utilisant la valeur de la propriété par défaut`, () => {
        const imageId = 'fd8c10f4-3cb4-4f25-bd7c-037d8e96be63';
        const url = pipe.transform({
            imageMediaId: imageId,
        });

        expect(url).toBeTruthy();
        expect(url.search(imageId)).toBeTruthy();
    });

    it(`doit retourner l'url d'acces à l'image de l'avatar en utilisant la valeur d\'une propriété personnaliée`, () => {
        const imageId = 'ac5a3033-687a-4c85-b6c7-16e752c3bfff';
        const url = pipe.transform(
            {
                imageId: imageId,
            },
            'imageId'
        );

        expect(url).toBeTruthy();
        expect(url.search(imageId)).toBeTruthy();
    });
});

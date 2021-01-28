import { PercentPipe } from './percent.pipe';
import { TestBed } from '@angular/core/testing';

describe('PercentPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PercentPipe]
        });
    });

    it('doit créer une instance', () => {
        const pipe = TestBed.inject(PercentPipe);
        expect(pipe).toBeTruthy();
    });

    it('convertit correctement en string localisée', () => {
        const pipe = TestBed.inject(PercentPipe);
        expect(pipe.transform('123.456', '4.5-5')).toEqual('0,123.45600 %');
    });
});

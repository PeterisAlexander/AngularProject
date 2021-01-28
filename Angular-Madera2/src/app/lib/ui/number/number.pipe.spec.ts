import { NumberPipe } from './number.pipe';
import { TestBed } from '@angular/core/testing';

describe('NumberPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NumberPipe]
        });
    });

    it('doit créer une instance', () => {
        const pipe = TestBed.inject(NumberPipe);
        expect(pipe).toBeTruthy();
    });

    it('convertit correctement en string localisée', () => {
        const pipe = TestBed.inject(NumberPipe);
        expect(pipe.transform('123.456', '4.5-5')).toEqual('0,123.45600');
    });
});

import { NoDataPipe } from './no-data.pipe';
import { TestBed } from '@angular/core/testing';

describe('NoDataPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NoDataPipe],
        });
    });

    it('doit créer une instance', () => {
        const pipe = new NoDataPipe();
        expect(pipe).toBeTruthy();
    });

    it('renvoie un - si la valeur vaut null', () => {
        const pipe = TestBed.inject(NoDataPipe);
        expect(pipe.transform(null)).toEqual('-');
    });

    it(`renvoie un - si la valeur vaut ''`, () => {
        const pipe = TestBed.inject(NoDataPipe);
        expect(pipe.transform('')).toEqual('-');
    });

    it('renvoie un libellé', () => {
        const pipe = TestBed.inject(NoDataPipe);
        expect(pipe.transform('libelle')).toEqual('libelle');
    });

    it('renvoie un entier', () => {
        const pipe = TestBed.inject(NoDataPipe);
        expect(pipe.transform(2)).toEqual(2);
    });
});

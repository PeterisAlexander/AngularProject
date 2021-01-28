import { CurrencyPipe } from './currency.pipe';
import { TestBed } from '@angular/core/testing';

describe('CurrencyPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CurrencyPipe]
        });
    });

    it('doit créer une instance', () => {
        const pipe = TestBed.inject(CurrencyPipe);
        expect(pipe).toBeTruthy();
    });

    it('détermine la bonne devise', () => {
        const pipe = TestBed.inject(CurrencyPipe);
        expect(pipe.transform('123456')).toEqual('$123,456.00');
    });
});

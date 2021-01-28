import { TimePipe } from './time.pipe';
import { TestBed } from '@angular/core/testing';

describe('TimePipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimePipe],
        });
    });

    it('doit créer une instance', () => {
        const pipe = TestBed.inject(TimePipe);
        expect(pipe).toBeTruthy();
    });

    it('conversion vers 0h01', () => {
        const pipe = TestBed.inject(TimePipe);
        expect(pipe.transform(1)).toEqual('0h01');
    });

    it('conversion vers 1h', () => {
        const pipe = TestBed.inject(TimePipe);
        expect(pipe.transform(60)).toEqual('1h');
    });

    it('conversion vers 1h01', () => {
        const pipe = TestBed.inject(TimePipe);
        expect(pipe.transform(61)).toEqual('1h01');
    });
});

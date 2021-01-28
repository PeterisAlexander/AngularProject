import { RangeDateLabelPipe } from './range-date-label.pipe';
import { TestBed } from '@angular/core/testing';
import moment from 'moment';

describe('RangeDateLabelPipe', () => {
    beforeEach(() => {
        moment.locale('fr-FR');

        TestBed.configureTestingModule({
            providers: [RangeDateLabelPipe],
        });
    });

    it('doit créer une instance', () => {
        const pipe = new RangeDateLabelPipe();
        expect(pipe).toBeTruthy();
    });

    it('renvoie une chaine vide', () => {
        const pipe = TestBed.inject(RangeDateLabelPipe);
        expect(pipe.transform(null)).toEqual('');
    });

    it('convertit en libellé Du ... au ...', () => {
        const pipe = TestBed.inject(RangeDateLabelPipe);
        expect(
            pipe.transform({
                dateDebut: moment('20201022').toDate(),
                dateFin: moment('20201023').toDate(),
            })
        ).toEqual('Du 22/10/2020 au 23/10/2020');
    });

    it('convertit en libellé Depuis le ...', () => {
        const pipe = TestBed.inject(RangeDateLabelPipe);
        expect(
            pipe.transform({
                dateDebut: moment('20201022').toDate(),
            })
        ).toEqual('Depuis le 22/10/2020');
    });

    it(`convertit en libellé Jusqu'au ...`, () => {
        const pipe = TestBed.inject(RangeDateLabelPipe);
        expect(
            pipe.transform({
                dateFin: moment('20201023').toDate(),
            })
        ).toEqual(`Jusqu'au 23/10/2020`);
    });
});

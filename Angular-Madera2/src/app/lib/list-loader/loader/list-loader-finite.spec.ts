import { of } from 'rxjs';
import { ListLoaderFinite } from './list-loader-finite';

describe('ListLoaderFinite', () => {
    it('doit se créer', () => {
        const loader = new ListLoaderFinite((p) => of([]));
        expect(loader).toBeTruthy();
    });

    it('getData doit récupérer toutes les données du dataFetcher et valoriser data', (done) => {
        const dfResult = [1, 2, 3, 4, 5];
        const loader = new ListLoaderFinite((p) => of(dfResult));

        const expected = [[], dfResult];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it('getData doit récupérer toutes les données des dataFetchers et valoriser data', (done) => {
        const dfResult1 = [1, 2, 3, 4, 5];
        const dfResult2 = [6, 7, 8, 9, 10];
        const loader = new ListLoaderFinite([
            (p) => of(dfResult1),
            (p) => of(dfResult2),
        ]);

        const expected = [[], [...dfResult1, ...dfResult2]];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });
});

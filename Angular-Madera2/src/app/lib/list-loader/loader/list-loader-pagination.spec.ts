import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { ListLoaderPagination } from './list-loader-pagination';

describe('ListLoaderPagination', () => {
    it('doit se créer', () => {
        const loader = new ListLoaderPagination((p) => of([]));
        expect(loader).toBeTruthy();
    });

    it('getPage doit retourner la page de données demandée et valoriser data', (done) => {
        const truncate = (list: any[], params: HttpParams): any[] => {
            return list.slice(
                parseInt(params.get('skip')),
                parseInt(params.get('skip')) + parseInt(params.get('top'))
            );
        };

        const dfResult = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const loader = new ListLoaderPagination((p) =>
            of(truncate(dfResult, p))
        );

        loader.count = 5;

        const expected = [[], [], [1, 2, 3, 4, 5], [], [11, 12, 13, 14, 15]];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 3) {
                loader.getPage(3);
            }

            if (result.length === 5) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getPage(1);
    });
});

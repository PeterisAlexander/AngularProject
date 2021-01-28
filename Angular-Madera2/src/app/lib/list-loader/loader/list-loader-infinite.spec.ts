import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { parseInt } from 'lodash';
import { skip } from 'rxjs/operators';
import { ListLoaderInfinite } from './list-loader-infinite';

describe('ListLoaderInfinite', () => {
    it('doit se créer', () => {
        const loader = new ListLoaderInfinite((p) => of([]));
        expect(loader).toBeTruthy();
    });

    it('getData doit récupérer une page de données du dataFetcher et valoriser data', (done) => {
        const dfResult = new Array(50);
        const loader = new ListLoaderInfinite((params) => {
            expect(params.get('top')).toBe(loader.count.toString());
            expect(params.get('skip')).toBe('0');
            return of(dfResult);
        });

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

    it('un 2ème appel au getData doit compléter les données', (done) => {
        const dfResult = new Array(50);
        const loader = new ListLoaderInfinite((params) => {
            if (result.length === 1) {
                expect(params.get('top')).toBe(loader.count.toString());
                expect(params.get('skip')).toBe('0');
            }

            if (result.length === 2) {
                expect(params.get('top')).toBe(loader.count.toString());
                expect(params.get('skip')).toBe(loader.count.toString());
            }

            return of(dfResult);
        });

        const expected = [[], dfResult, [...dfResult, ...dfResult]];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                loader.getData();
            }

            if (result.length === 3) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it("si la 1ère source de données n'a plus de donnée, alors getData complète avec la 2ème source de données", (done) => {
        const dfResult1 = new Array(2);
        const dfResult2 = new Array(20);

        const truncate = (list: any[], params: HttpParams): any[] => {
            return list.slice(
                parseInt(params.get('skip')),
                parseInt(params.get('skip')) + parseInt(params.get('top'))
            );
        };

        const loader = new ListLoaderInfinite([
            (params) => {
                expect(params.get('top')).toBe('5');
                expect(params.get('skip')).toBe('0');
                return of(truncate(dfResult1, params));
            },
            (params) => {
                expect(params.get('top')).toBe('3');
                expect(params.get('skip')).toBe('0');
                return of(truncate(dfResult2, params));
            },
        ]);

        loader.count = 5;

        const expected = [[], new Array(5)];
        const result: number[][] = [];

        loader.data.subscribe((data) => result.push(data));

        // permet de vérifier qu'il n'y que 2 changements de isLoading : false => true => false
        // alors qu'il y a plusieurs requêtes appelées, le true doit encapsuler toutes les requêtes
        loader.isLoading.pipe(skip(2)).subscribe(() => {
            expect(result).toEqual(expected);
            done();
        });

        loader.getData();
    });
});

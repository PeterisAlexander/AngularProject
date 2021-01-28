import { HttpParams } from '@angular/common/http';
import { listLoaderEmpty, prepareGroupedData } from './list-loader.utility';

describe('ListLoaderUtiliy', () => {
    it('listLoaderEmpty doit simuler une fonction de récupération de données (sans données)', () => {
        listLoaderEmpty(new HttpParams()).subscribe((result) =>
            expect(result).toEqual([])
        );
    });

    it('prepareGroupedData doit regrouper les données', () => {
        const data = [{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 3 }];

        const finalData = [
            { items: [{ a: 1 }, { a: 1 }], value: 1 },
            { items: [{ a: 2 }], value: 2 },
            { items: [{ a: 3 }, { a: 3 }], value: 3 },
        ];

        const prepareData = prepareGroupedData((groupBy) => {
            const result = groupBy('a').merge([]);

            expect(result).toEqual(finalData);
        });

        prepareData(data);
    });

    it('prepareGroupedData doit pouvoir regrouper les données plusieurs fois', () => {
        const data = [
            { a: { b: 1, c: 1 } },
            { a: { b: 2, c: 1 } },
            { a: { b: 2, c: 1 } },
            { a: { b: 3, c: 2 } },
        ];

        const finalData = [
            {
                value: 1,
                items: [
                    {
                        value: { b: 1, c: 1 },
                        items: [{ a: { b: 1, c: 1 } }],
                    },
                    {
                        value: { b: 2, c: 1 },
                        items: [{ a: { b: 2, c: 1 } }, { a: { b: 2, c: 1 } }],
                    },
                ],
            },
            {
                value: 2,
                items: [
                    {
                        items: [{ a: { b: 3, c: 2 } }],
                        value: { b: 3, c: 2 },
                    },
                ],
            },
        ];

        const prepareData = prepareGroupedData((groupBy) => {
            const result = groupBy('a').groupBy('value.c').merge([]);

            expect(result).toEqual(finalData);
        });

        prepareData(data);
    });

    it('prepareGroupedData doit fusionner les données après regroupement', () => {
        const baseData = [
            {
                value: 1,
                items: [
                    {
                        value: { b: 1, c: 1 },
                        items: [{ a: { b: 1, c: 1 } }],
                    },
                    {
                        value: { b: 2, c: 1 },
                        items: [{ a: { b: 2, c: 1 } }],
                    },
                ],
            },
        ];

        const newData = [{ a: { b: 2, c: 1 } }, { a: { b: 3, c: 2 } }];

        const finalData = [
            {
                value: 1,
                items: [
                    {
                        value: { b: 1, c: 1 },
                        items: [{ a: { b: 1, c: 1 } }],
                    },
                    {
                        value: { b: 2, c: 1 },
                        items: [{ a: { b: 2, c: 1 } }, { a: { b: 2, c: 1 } }],
                    },
                ],
            },
            {
                value: 2,
                items: [
                    {
                        items: [{ a: { b: 3, c: 2 } }],
                        value: { b: 3, c: 2 },
                    },
                ],
            },
        ];

        const prepareData = prepareGroupedData((groupBy) => {
            const result = groupBy('a').groupBy('value.c').merge(baseData);

            expect(result).toEqual(finalData);
        });

        prepareData(newData);
    });
});

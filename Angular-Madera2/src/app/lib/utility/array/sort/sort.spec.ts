import { sort, sortFn } from './sort';

describe('sort', () => {
    it('doit pouvoir trier une liste de scalaire', () => {
        const list1 = [3, 1, 2];
        const list2 = ['3', '1', '2'];

        const list1Sorted = sort(list1);
        const list2Sorted = sort(list2);

        expect(list1Sorted[0]).toEqual(1);
        expect(list1Sorted[1]).toEqual(2);
        expect(list1Sorted[2]).toEqual(3);

        expect(list2Sorted[0]).toEqual('1');
        expect(list2Sorted[1]).toEqual('2');
        expect(list2Sorted[2]).toEqual('3');
    });

    it(`doit pouvoir trier une liste d'objet`, () => {
        const list = [{ a: { b: 3 } }, { a: { b: 1 } }, { a: { b: 2 } }];

        const listSorted = sort(list, 'a.b');

        expect(listSorted[0].a.b).toEqual(1);
        expect(listSorted[1].a.b).toEqual(2);
        expect(listSorted[2].a.b).toEqual(3);
    });

    it(`doit pouvoir trier une liste d'objet avec un tri cumulatif`, () => {
        const list = [
            { a: 1, b: 3 },
            { a: 1, b: 2 },
            { a: 2, b: 2 },
        ];

        const listSorted = sort(list, ['a', 'b']);

        expect(listSorted[0].b).toEqual(2);
        expect(listSorted[1].b).toEqual(3);
        expect(listSorted[2].a).toEqual(2);
    });

    it('doit pouvoir trier une liste en ordre descendant', () => {
        const list = [3, 1, 2];

        const listSorted = sort(list, null, false);

        expect(listSorted[0]).toEqual(3);
        expect(listSorted[1]).toEqual(2);
        expect(listSorted[2]).toEqual(1);
    });

    it('doit pouvoir trier une liste avec les valeurs null en dernier', () => {
        const list = [3, null, 2];

        const listSorted = sort(list, null);

        expect(listSorted[0]).toEqual(2);
        expect(listSorted[1]).toEqual(3);
        expect(listSorted[2]).toEqual(null);
    });

    it('doit pouvoir trier grâce à une fonction', () => {
        interface Item {
            isBefore: boolean;
            name: string;
        }

        const list: Item[] = [
            { name: 'Laura', isBefore: false },
            { name: 'Arthur', isBefore: false },
            { name: 'Bonnie', isBefore: true },
            { name: 'Rebecca', isBefore: true },
        ];

        const sortFunction = (elem1: Item, elem2: Item) => {
            if (elem1.isBefore === elem2.isBefore) {
                return elem1.name < elem2.name ? -1 : 1;
            } else {
                return elem1.isBefore ? -1 : 1;
            }
        };

        const sortedList = sortFn(list, sortFunction);

        expect(sortedList[0]).toEqual({ name: 'Bonnie', isBefore: true });
        expect(sortedList[1]).toEqual({ name: 'Rebecca', isBefore: true });
        expect(sortedList[2]).toEqual({ name: 'Arthur', isBefore: false });
        expect(sortedList[3]).toEqual({ name: 'Laura', isBefore: false });
    });
});

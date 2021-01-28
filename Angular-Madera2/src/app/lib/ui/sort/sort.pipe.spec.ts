import { SortPipe } from './sort.pipe';
import { TestBed } from '@angular/core/testing';

describe('SortPipe', () => {
    let pipe: SortPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SortPipe]
        });

        pipe = TestBed.inject(SortPipe);
    });

    it('doit créer une instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('doit pouvoir trier une liste de scalaire', () => {
        const list1 = [3, 1, 2];
        const list2 = ['3', '1', '2'];

        const list1Sorted = pipe.transform(list1);
        const list2Sorted = pipe.transform(list2);

        expect(list1Sorted[0]).toEqual(1);
        expect(list1Sorted[1]).toEqual(2);
        expect(list1Sorted[2]).toEqual(3);

        expect(list2Sorted[0]).toEqual('1');
        expect(list2Sorted[1]).toEqual('2');
        expect(list2Sorted[2]).toEqual('3');
    });

    it(`doit pouvoir trier une liste d'objet`, () => {
        const list = [{ a: { b: 3 } }, { a: { b: 1 } }, { a: { b: 2 } }];

        const listSorted = pipe.transform(list, 'a.b');

        expect(listSorted[0].a.b).toEqual(1);
        expect(listSorted[1].a.b).toEqual(2);
        expect(listSorted[2].a.b).toEqual(3);
    });

    it(`doit pouvoir trier une liste d'objet avec un tri cumulatif`, () => {
        const list = [
            { a: 1, b: 3 },
            { a: 1, b: 2 },
            { a: 2, b: 2 }
        ];

        const listSorted = pipe.transform(list, ['a', 'b']);

        expect(listSorted[0].b).toEqual(2);
        expect(listSorted[1].b).toEqual(3);
        expect(listSorted[2].a).toEqual(2);
    });

    it('doit pouvoir trier une liste en ordre descendant', () => {
        const list = [3, 1, 2];

        const listSorted = pipe.transform(list, null, false);

        expect(listSorted[0]).toEqual(3);
        expect(listSorted[1]).toEqual(2);
        expect(listSorted[2]).toEqual(1);
    });

    it('doit pouvoir trier une liste avec les valeurs null en dernier', () => {
        const list = [3, null, 2];

        const listSorted = pipe.transform(list, null);

        expect(listSorted[0]).toEqual(2);
        expect(listSorted[1]).toEqual(3);
        expect(listSorted[2]).toEqual(null);
    });
});

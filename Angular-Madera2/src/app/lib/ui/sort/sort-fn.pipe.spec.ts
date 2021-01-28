import { TestBed } from '@angular/core/testing';

import { SortFnPipe } from './sort-fn.pipe';

describe('SortFnPipe', () => {
    let pipe: SortFnPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SortFnPipe],
        });

        pipe = TestBed.inject(SortFnPipe);
    });

    it('doit créer une instance', () => {
        expect(pipe).toBeTruthy();
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

        const sortedList = pipe.transform(list, sortFunction);

        expect(sortedList[0]).toEqual({ name: 'Bonnie', isBefore: true });
        expect(sortedList[1]).toEqual({ name: 'Rebecca', isBefore: true });
        expect(sortedList[2]).toEqual({ name: 'Arthur', isBefore: false });
        expect(sortedList[3]).toEqual({ name: 'Laura', isBefore: false });
    });
});

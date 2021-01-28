import { moveDroppedInList } from './drop-tree.utility';

describe('moveDroppedInList', () => {
    it(`Doit déplacer les items droppés à leur nouvelle position dans la liste`, () => {
        const data = [0, 1, 2, 3, 4, 5];

        moveDroppedInList(data, {
            count: 3,
            nextContainerId: '1',
            nextIndent: 0,
            nextIndex: 0,
            nextIndexBeforeListUpdate: 0,
            previousContainerId: '1',
            previousIndent: 0,
            previousIndex: 3,
        });

        expect(data).toEqual([3, 4, 5, 0, 1, 2]);
    });

    it(`Doit déplacer les items droppés à leur nouvelle position dans la 2ème liste`, () => {
        const data1 = [0, 1, 2, 3, 4, 5];
        const data2 = [10, 11, 12];

        moveDroppedInList(
            data2,
            {
                count: 3,
                nextContainerId: '2',
                nextIndent: 0,
                nextIndex: 0,
                nextIndexBeforeListUpdate: 0,
                previousContainerId: '1',
                previousIndent: 0,
                previousIndex: 3,
            },
            null,
            null,
            data1
        );

        expect(data1).toEqual([0, 1, 2]);
        expect(data2).toEqual([3, 4, 5, 10, 11, 12]);
    });

    it(`Doit exécuter la foncton updateOrderFn sur tous les items de la liste`, () => {
        const data = [
            { id: 1, order: 0 },
            { id: 2, order: 0 },
            { id: 3, order: 0 },
        ];

        moveDroppedInList(
            data,
            {
                count: 1,
                nextContainerId: '1',
                nextIndent: 0,
                nextIndex: 0,
                nextIndexBeforeListUpdate: 0,
                previousContainerId: '1',
                previousIndent: 0,
                previousIndex: 1,
            },
            (item: { id: number; order: number }, order: number) => {
                item.order = order;
            }
        );

        expect(data).toEqual([
            { id: 2, order: 0 },
            { id: 1, order: 1 },
            { id: 3, order: 2 },
        ]);
    });

    it(`Doit exécuter la foncton updateIndentFn sur tous les items déplacés`, () => {
        const data = [
            { id: 1, indent: 0 },
            { id: 2, indent: 0 },
            { id: 3, indent: 0 },
        ];

        moveDroppedInList(
            data,
            {
                count: 1,
                nextContainerId: '1',
                nextIndent: 1,
                nextIndex: 1,
                nextIndexBeforeListUpdate: 1,
                previousContainerId: '1',
                previousIndent: 0,
                previousIndex: 1,
            },
            null,
            (item: { id: number; indent: number }, indentDiff: number) => {
                item.indent = item.indent + indentDiff;
            }
        );

        expect(data).toEqual([
            { id: 1, indent: 0 },
            { id: 2, indent: 1 },
            { id: 3, indent: 0 },
        ]);
    });
});

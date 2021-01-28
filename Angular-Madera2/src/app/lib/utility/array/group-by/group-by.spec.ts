import { groupBy, groupByFn } from './group-by';
import { GroupingModel } from './grouping.model';

describe('groupBy', () => {
    it('doit regrouper les éléments de la liste', () => {
        const list = [{ a: 0 }, { a: 0 }, { a: 1 }];

        const newList = groupBy(list, 'a');
        expect(newList.length).toEqual(2);
        expect(newList[0].value).toEqual(0);
        expect(newList[0].items.length).toEqual(2);
        expect(newList[1].value).toEqual(1);
        expect(newList[1].items.length).toEqual(1);
    });

    it('doit regrouper les éléments de la liste selon une propriété', () => {
        const group1 = { id: 1, nom: 'group1' };
        const group2 = { id: 2, nom: 'group2' };
        const list = [
            { a: { id: 1, nom: 'group1' }, b: 'coucou1' },
            { a: { id: 1, nom: 'group1' }, b: 'coucou2' },
            { a: { id: 2, nom: 'group2' }, b: 'coucou3' },
        ];

        const newList = groupBy(list, 'a');
        expect(newList.length).toEqual(2);
        expect(newList[0].value).toEqual(group1);
        expect(newList[0].items.length).toEqual(2);
        expect(newList[1].value).toEqual(group2);
        expect(newList[1].items.length).toEqual(1);
    });

    it('doit regrouper les éléments de la liste selon une fonction', () => {
        const group1 = { id: 1, type: 'type1' };
        const group2 = { id: 1, type: 'type2' };
        const group3 = { id: 2, type: 'type2' };
        const list = [
            { a: { id: 1 }, nom: 'Élément 1', type: 'type1' },
            { a: { id: 1 }, nom: 'Élément 2', type: 'type2' },
            { a: { id: 2 }, nom: 'Élément 3', type: 'type2' },
            { a: { id: 2 }, nom: 'Élément 4', type: 'type2' },
            { a: { id: 1 }, nom: 'Élément 5', type: 'type2' },
        ];

        const groupedList = groupByFn(list, (element) => ({
            id: element.a.id,
            type: element.type,
        }));
        expect(groupedList.length).toEqual(3);
        expect(groupedList[0].value).toEqual(group1);
        expect(groupedList[0].items.length).toEqual(1);
        expect(groupedList[1].value).toEqual(group2);
        expect(groupedList[1].items.length).toEqual(2);
        expect(groupedList[2].value).toEqual(group3);
        expect(groupedList[2].items.length).toEqual(2);
    });
});

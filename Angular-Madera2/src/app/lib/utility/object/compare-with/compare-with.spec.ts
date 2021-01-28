import { compareWithId, compareWithProp, compareWithFn } from './compare-with';

describe('compareWith X', () => {
    it('compareWithId doit retourner true si 2 objet ont le même id', () => {
        const o1 = { id: 1 };
        const o1Bis = { id: 1 };
        const o2 = { id: 2 };

        expect(compareWithId(o1, o1Bis)).toBeTruthy();
        expect(compareWithId(o1, o2)).toBeFalsy();
    });

    it('compareWithProp doit retourner true si 2 objet ont la valeur pour la propriété demandée', () => {
        const o1 = { id: 1 };
        const o1Bis = { id: 1 };
        const o2 = { id: 2 };

        expect(compareWithProp(o1, o1Bis, 'id')).toBeTruthy();
        expect(compareWithProp(o1, o2, 'id')).toBeFalsy();
    });

    it('compareWithFn doit retourner true si 2 objet ont la valeur retournée par la fonction', () => {
        const o1 = { id: 1 };
        const o1Bis = { id: 1 };
        const o2 = { id: 2 };
        const getValue = obj => obj.id;

        expect(compareWithFn(o1, o1Bis, getValue)).toBeTruthy();
        expect(compareWithFn(o1, o2, getValue)).toBeFalsy();
    });
});

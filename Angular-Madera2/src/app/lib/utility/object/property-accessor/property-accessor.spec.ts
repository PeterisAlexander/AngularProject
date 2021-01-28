import { getPathValue, setPathValue } from './property-accessor';

describe('propertyAccessor', () => {
    it('getPathValue doit retourner la valeur de la propriété', () => {
        const obj = {
            a: {
                b: {
                    c: 0
                }
            }
        };

        expect(getPathValue(obj, 'a.b.c')).toEqual(0);
    });

    it('getPathValue doit retourner null si une partie du chemin est manquante', () => {
        const obj = {
            a: {}
        };

        expect(getPathValue(obj, 'a.b.c')).toBeNull();
    });

    it('setPathValue doit assigner la valeur de la propriété imbriquée', () => {
        const obj: { a?: { b?: { c?: number } } } = {};

        setPathValue(obj, 'a.b.c', 0);

        expect(obj.a.b.c).toEqual(0);
    });
});

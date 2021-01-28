import { highlight } from './highlight';

describe('highlight', () => {
    it(`l'option accentSensitive permet d'ignorer les accents`, () => {
        const str = 'abc';

        expect(highlight(str, 'à', { accentSensitive: false })).toEqual(
            '<b>a</b>bc'
        );
        expect(highlight(str, 'à', { accentSensitive: true })).toEqual(str);
    });

    it(`l'option caseSensitive permet d'ignorer la casse`, () => {
        const str = 'abc';

        expect(highlight(str, 'A', { caseSensitive: false })).toEqual(
            '<b>a</b>bc'
        );
        expect(highlight(str, 'A', { caseSensitive: true })).toEqual(str);
    });

    it(`l'option replacement permet de spécifier la chaine de remplacement`, () => {
        const str = 'abc';

        expect(highlight(str, 'a', { replacement: '<i>{s}</i>' })).toEqual(
            '<i>a</i>bc'
        );
    });
});

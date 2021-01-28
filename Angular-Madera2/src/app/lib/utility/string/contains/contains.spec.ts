import { contains } from './contains';

describe('contains', () => {
    it(`l'option accentSensitive permet d'ignorer les accents`, () => {
        expect(contains('aaa', 'àà', { accentSensitive: false })).toBeTruthy();
        expect(contains('aaa', 'àà', { accentSensitive: true })).toBeFalsy();
    });

    it(`l'option caseSensitive permet d'ignorer la casse`, () => {
        expect(contains('aaa', 'AA', { caseSensitive: false })).toBeTruthy();
        expect(contains('aaa', 'AA', { caseSensitive: true })).toBeFalsy();
    });

    it(`l'option spaceSensitive permet de d'ignorer les multiples espaces`, () => {
        expect(
            contains('aa  a', 'a a', { spaceSensitive: false })
        ).toBeTruthy();
        expect(contains('aa  a', 'a a', { spaceSensitive: true })).toBeFalsy();
    });
});

import { isEqual } from './is-equal';

describe('isEqual', () => {
    it(`l'option accentSensitive permet d'ignorer les accents`, () => {
        expect(isEqual('aaa', 'ààà', { accentSensitive: false })).toBeTruthy();
        expect(isEqual('aaa', 'ààà', { accentSensitive: true })).toBeFalsy();
    });

    it(`l'option caseSensitive permet d'ignorer la casse`, () => {
        expect(isEqual('aaa', 'AAA', { caseSensitive: false })).toBeTruthy();
        expect(isEqual('aaa', 'AAA', { caseSensitive: true })).toBeFalsy();
    });

    it(`l'option spaceSensitive permet de d'ignorer les multiples espaces`, () => {
        expect(
            isEqual('aa  a', 'aa a', { spaceSensitive: false })
        ).toBeTruthy();
        expect(isEqual('aa  a', 'aa a', { spaceSensitive: true })).toBeFalsy();
    });
});

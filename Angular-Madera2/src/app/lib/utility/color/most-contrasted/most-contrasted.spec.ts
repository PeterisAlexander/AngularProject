import { mostContrasted } from './most-contrasted';

describe('mostContrasted', () => {
    it('doit retourner la couleur qui contraste le plus avec la couleur de référence', () => {
        const white = '#FFF';
        const black = '#000';

        expect(mostContrasted('#111', white, black)).toEqual(white);
        expect(mostContrasted('#EEE', white, black)).toEqual(black);
    });
});

import { addSlash } from './add-slash';

describe('addSlash', () => {
    it(`doit retourner la chaine passée en argument suivie d'un slash`, () => {
        expect(addSlash('MaSuperChaine')).toEqual('MaSuperChaine/');
    });

    it(`doit retourner la chaine passée en argument dans l'état si un slash est déjà présent en fin de cette chaine`, () => {
        expect(addSlash('MaSuperChaine/')).toEqual('MaSuperChaine/');
    });
});

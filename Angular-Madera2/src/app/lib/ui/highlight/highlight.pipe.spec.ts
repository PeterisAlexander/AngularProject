import { HighlightPipe } from './highlight.pipe';

describe('Pipe: Highlight', () => {
    it('doit créer une instance', () => {
        const pipe = new HighlightPipe();
        expect(pipe).toBeTruthy();
    });

    it('doit retourner la chaine de caractère mise en forme.', () => {
        const pipe = new HighlightPipe();
        const result = pipe.transform('StringSearch in list', 'StringSearch');

        expect(result).toBe(
            '<span class="textHighlight">StringSearch</span> in list'
        );
    });

    it('doit retourner une chaine vide si la chaîne dans laquelle rechercher vide.', () => {
        const pipe = new HighlightPipe();
        const result = pipe.transform('', 'StringSearch');

        expect(result).toBe('');
    });

    it('doit retourner une chaîne vide si la chaîne dans laquelle rechercher est null.', () => {
        const pipe = new HighlightPipe();
        const result = pipe.transform(null, 'StringSearch');

        expect(result).toBe('');
    });

    it('doit retourner la valeur transmise si la query est une chaine vide.', () => {
        const pipe = new HighlightPipe();
        const result = pipe.transform('test', '');

        expect(result).toBe('test');
    });

    it('doit retourner la valeur transmise si la query est null.', () => {
        const pipe = new HighlightPipe();
        const result = pipe.transform('test', null);

        expect(result).toBe('test');
    });
});

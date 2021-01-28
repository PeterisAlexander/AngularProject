import { HighlightSearchPipe } from './highlight-search.pipe';
import { HighlightSearchService } from './highlight-search.service';

describe('Pipe: HighlightSearch', () => {
    let pipe: HighlightSearchPipe;

    const spySearchService = jasmine.createSpyObj<HighlightSearchService>(
        'HighlightSearchService',
        ['query']
    );

    it('doit être créé', () => {
        pipe = new HighlightSearchPipe(spySearchService);
        expect(pipe).toBeTruthy();
    });

    it('doit retourner la chaine de caractère recherché comme elle est contenue dans la chaine transmise au transform.', () => {
        pipe = new HighlightSearchPipe(spySearchService);
        spySearchService.query = 'test';

        const searchString = pipe.transform('ValeurTest');

        expect(searchString).toEqual(
            'Valeur<span class="textHighlight">Test</span>'
        );
    });
});

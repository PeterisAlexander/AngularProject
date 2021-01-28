import { Pipe, PipeTransform } from '@angular/core';
import { HighlightPipe } from '../highlight.pipe';
import { HighlightSearchService } from './highlight-search.service';

@Pipe({
    name: 'appHighlightSearch',
    pure: false,
})
export class HighlightSearchPipe
    extends HighlightPipe
    implements PipeTransform {
    public constructor(private _searchService: HighlightSearchService) {
        super();
    }

    /**
     * Renvoie la chaine de caractère mise en subrillance suivant la valeur rechercher.
     * Cette dernière est récupéré à l'aide d'un service mis à jour par le composant de filtre.
     */
    public transform(value: string): string {
        return super.transform(value, this._searchService.query);
    }
}

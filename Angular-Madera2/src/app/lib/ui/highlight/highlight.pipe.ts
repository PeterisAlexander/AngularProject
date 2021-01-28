import { Pipe, PipeTransform } from '@angular/core';
import { HighlightOption } from '../../utility/string/highlight/highlight-option';
import { highlight } from '../../utility/string/highlight/highlight';

/**
 * Permet de mettre en subrillance une chaine de charatères.
 * Prend en paramètre une query pour appliquer spécifiquement la subrillance à cette query dans la chaine transmise.
 */
@Pipe({
    name: 'appHighlight',
})
export class HighlightPipe implements PipeTransform {
    /**
     * Renvoie la chaine de charactère mise en subrillance.
     */
    public transform(value: string, query = ''): string {
        const optionsHighlight: HighlightOption = {
            accentSensitive: false,
            caseSensitive: false,
            replacement: '<span class="textHighlight">{s}</span>',
        };

        return highlight(value || '', query || '', optionsHighlight);
    }
}

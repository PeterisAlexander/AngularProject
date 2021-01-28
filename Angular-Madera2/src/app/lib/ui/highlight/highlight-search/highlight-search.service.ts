import { Injectable } from '@angular/core';

/**
 * Permet de stocké la valeur recherché pour la mettre en surbrillance.
 */
@Injectable({
    providedIn: 'root'
})
export class HighlightSearchService {
    /**
     * Valeur courante recherché.
     */
    public query = '';
}

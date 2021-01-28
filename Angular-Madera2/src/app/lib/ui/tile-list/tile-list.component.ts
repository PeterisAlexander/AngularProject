import { Component, QueryList, ContentChildren } from '@angular/core';
import { TileComponent } from '../tile/tile.component';

@Component({
    selector: 'app-tile-list',
    templateUrl: './tile-list.component.html',
    styleUrls: ['./tile-list.component.css'],
})
export class TileListComponent {
    /**
     * Indique s'il y a au moins une tuile
     */
    public get hasContent(): boolean {
        return this._tiles != null && this._tiles.length > 0;
    }

    /**
     * Liste des tuiles
     */
    @ContentChildren(TileComponent, { descendants: true })
    private _tiles: QueryList<TileComponent>;
}

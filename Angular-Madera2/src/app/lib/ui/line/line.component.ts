import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.css'],
})
export class LineComponent {
    /**
     * Couleur du composant
     */
    @HostBinding('style.background-color')
    @Input()
    public color: string;

    /**
     * La ligne se trouve dans un item ?
     */
    @Input()
    public inList = false;

    /**
     * Hauteur du composant
     */
    @HostBinding('style.height.px')
    @Input()
    public height: number;

    /**
     * Largeur du composant
     */
    @HostBinding('style.width.px')
    @Input()
    public width: number;

    /**
     * Indique si un un border radius est défini en top left et top right
     */
    @HostBinding('class.topBorder')
    @Input()
    public hasBorderTop: boolean;

    /**
     * Indique si un un border radius est défini en bottom left et top right
     */
    @HostBinding('class.bottomBorder')
    @Input()
    public hasBorderBottom: boolean;

    /**
     * Initialise les propriétés
     */
    public constructor() {
        this.hasBorderTop = true;
        this.hasBorderBottom = true;
    }
}

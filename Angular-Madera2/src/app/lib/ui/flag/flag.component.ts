import { Component, Input, HostBinding, ContentChild } from '@angular/core';
import { BoxComponent } from '../box/box.component';

/**
 * Composant permettant l'ajout d'une petite étiquette de couleur.
 * Suivant le contexte l'étiquette de couleur se trouvera soit
 *   --> Quand afficher avant une card : en haut à droite de l'élément
 *   --> Quand le flag contient une box : en haut à gauche de la box (en dehors de la box)
 *   --> Autre contexte non géré
 */
@Component({
    selector: 'app-flag',
    templateUrl: './flag.component.html',
    styleUrls: ['./flag.component.css']
})
export class FlagComponent {
    @Input()
    public color: string;

    @HostBinding('class.flag-withBox')
    @ContentChild(BoxComponent)
    public boxComponent: BoxComponent;
}

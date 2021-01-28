import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { predefinedColors } from './predefined-color';

/**
 * Panel de sélection de couleurs
 */
@Component({
    selector: 'app-color-picker-panel',
    templateUrl: './color-picker-panel.component.html',
    styleUrls: ['./color-picker-panel.component.css'],
})
export class ColorPickerPanelComponent implements OnInit {
    /**
     * La liste des couleurs disponibles
     */
    public colors: string[][] = [];

    /**
     * Événement déclenché lors de la sélection d'une couleur
     */
    @Output()
    public colorSelected = new EventEmitter<string>();

    /**
     * Couleur que l'on souhaite éditer (pour savoir
     * laquelle doit être cochée par défaut)
     */
    @Input()
    public colorToEdit: string;

    /**
     * Nombre de couleurs à faire afficher par ligne
     */
    private readonly _colorsPerLine = 4;

    /**
     * Formation du tableau de couleurs à 2 dimensions
     */
    public ngOnInit(): void {
        const amountOfLines = Math.ceil(
            predefinedColors.length / this._colorsPerLine
        );
        for (let i = 0; i < amountOfLines; i++) {
            this.colors[i] = [];
            for (let j = 0; j < this._colorsPerLine; j++) {
                if (predefinedColors[i * this._colorsPerLine + j]) {
                    this.colors[i][j] =
                        predefinedColors[i * this._colorsPerLine + j];
                }
            }
        }
    }

    /**
     * A la sélection d'une couleur, émet l'événement adéquat
     */
    public selectColor(color: string): void {
        this.colorSelected.emit(color);
    }
}

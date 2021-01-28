import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CustomFile } from 'src/app/lib/custom-file/custom-file';
import { CustomFileService } from 'src/app/lib/custom-file/custom-file.service';

/**
 * Composant pour la gestion des envois de fichiers
 * Ce composant peut gérer les envoies simples et multiples
 */
@Component({
    selector: 'app-filepicker',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilepickerComponent),
            multi: true,
        },
    ],
    templateUrl: './filepicker.component.html',
    styleUrls: ['./filepicker.component.css'],
})
export class FilepickerComponent implements ControlValueAccessor {
    /**
     * Liste des fichiers acceptés par la zone de fichiers
     */
    @Input()
    public accept: string;

    /**
     * Couleur du fond du bouton
     */
    @Input()
    public backgroundColor = '';

    /**
     * Contenu du bouton de fichiers
     */
    @Input()
    public content = 'Parcourir...';

    /**
     * Active / Désactive la composant
     */
    @Input()
    public disabled = false;

    /**
     * Type du encodage
     */
    @Input()
    public encType = 'multipart/form-data';

    /**
     * Couleur de l'icone et du texte du bouton
     */
    @Input()
    public fontColor = '';

    /**
     * Hauteur du bouton (px)
     */
    @Input()
    public height: number;

    /**
     * Nom de l'icone à faire afficher dans le bouton
     */
    @Input()
    public icon: string;

    /**
     * Taille de l'icone (px)
     */
    @Input()
    public iconSize: number;

    /**
     * Gestion de la sélection multiple
     */
    @Input()
    public multiple = false;

    /**
     * Nom du champs pour les transferts de données
     */
    @Input()
    public name: string;

    /**
     * Forme du bouton ngZorro (circle, round)
     */
    @Input()
    public nzButtonShape = '';

    /**
     * Type du bouton ngZorro (primary, default, dashed, danger, link)
     */
    @Input()
    public nzButtonType = 'default';

    /**
     * Liste des fichiers à uploader
     */

    get value(): Array<CustomFile> {
        return this._value;
    }

    set value(value: Array<CustomFile>) {
        this._value = value;
        this.valueChange.emit(this._value);
    }

    /**
     * Émet l'événement de changement de valeur de la propriété value
     */
    @Output()
    public valueChange = new EventEmitter<Array<CustomFile>>();

    /**
     * Largeur du bouton (px)
     */
    @Input()
    public width: number;

    /**
     * Composant natif de type inputFile
     */
    @ViewChild('inputFile', { static: true })
    private _inputFile: ElementRef;

    private _value: Array<CustomFile> = [];

    public constructor(
        private _elementRef: ElementRef,

        private _customFileUtility: CustomFileService
    ) {}

    /**
     * Actions effectuées lors du blur du bouton
     */
    public handleBlur(): void {
        this.onTouched();
    }

    /**
     * Action à effectuer lors d'un changement
     */
    public handleChange(event: Event): void {
        // On stop la propagation de l'événement pour le repropager ensuite.
        // La raison est que le traitement sur l'événement change est asynchrone,
        // hors depuis un composant parent on peut vouloir récupérer la valeur lors de cet événement,
        // dès lors cela signifie qu'il faut arrêter l'événement > effectuer le traitement > redémarrer l'événement
        event.stopPropagation();

        const target = event.target as HTMLInputElement;

        const changeSubscription = forkJoin(
            Array.from(target.files).map((file: File) =>
                this._customFileUtility.createFromFile(file)
            )
        ).subscribe((files: CustomFile[]) => {
            changeSubscription.unsubscribe();
            this.value = files;
            this.onChange(this.value);
            this._elementRef.nativeElement.dispatchEvent(event);
        });
    }

    /*
     * Action à effectuer lors d'un clic
     */
    public handleClick(): void {
        this._inputFile.nativeElement.click();
    }

    /**
     * Mise en place d'un écouteur sur l'événement Change
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Mise en place d'un écouteur sur l'événement Touched
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Possibilité de désactiver le composant
     */
    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Mise à jour de la propriété Value du composant
     */
    public writeValue(obj: any): void {
        this.value = obj;
    }

    /**
     * Méthode à appeler lorsque la valeur du composant change
     */
    private onChange(value: any): void {}

    /**
     * Méthode à appeler lorsque le composant doit être considéré comme "blurred" ou "touched".
     */
    private onTouched(): void {}
}

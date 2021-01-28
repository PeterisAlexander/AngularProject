import {
    Component,
    Input,
    EventEmitter,
    Output,
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPickerComponent),
            multi: true,
        },
    ],
})
export class ColorPickerComponent implements ControlValueAccessor {
    @Input()
    public disabled = false;

    /**
     * Permet de gérer l'affichage du popOver sur la couleur précédemment sélectionnée.
     */
    public popOverColorSelectedVisible = false;

    /**
     * Permet de gérer l'affichage du popOver sur le picto de selection d'une couleur.
     */
    public popOverPictoVisible = false;

    /**
     * Couleur sélectionnée.
     */
    @Input()
    public get value(): string {
        return this._value;
    }

    public set value(value: string) {
        if (this.value !== value) {
            this.popOverPictoVisible = false;
            this.popOverColorSelectedVisible = false;
            this._value = value;
            this.valueChange.emit(this._value);
        }
    }

    @Output()
    public valueChange = new EventEmitter<string>();

    private _value: string;

    public dropColor(): void {
        this.value = null;
        this.onTouched();
        this.onChange(this._value);
    }

    public onTouched(): void {}

    /**
     * Permet à l'API Reactive Forms d'enregistrer un callback appelé
     * lorsque la valeur du composant change.
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Permet à l'API Reactive Forms d'enregistrer un callback appelé
     * lorsque le composant doit être considéré comme "blurred" ou "touched".
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Permet de selectionner un item (couleur).
     */
    public selectItem(item: string): void {
        this.value = item;
        this.onChange(this._value);
    }

    /**
     * Permet à l'API Reactive Forms de modifier l'état du composant.
     */
    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Permet à l'API Reactive Forms de modifier la valeur du composant.
     */
    public writeValue(obj: any): void {
        this.value = obj;
    }

    private onChange(value: any): void {}
}

import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CustomFile } from 'src/app/lib/custom-file/custom-file';

/**
 * Composant qui regroupe les composants
 *  - FilePicker
 *  - Avatar
 *
 * Si la photo est null, on affiche le FilePicker
 * sinon on affiche l'avatar avec la photo dedans
 */
@Component({
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AvatarPickerComponent),
        },
    ],
    selector: 'app-avatar-picker',
    styleUrls: ['./avatar-picker.component.css'],
    templateUrl: './avatar-picker.component.html',
})
export class AvatarPickerComponent
    implements OnInit, OnDestroy, ControlValueAccessor {
    /**
     * Label de l'avatar picker quand il ne contient pas d'image.
     */
    @Input()
    public avatarLabel = 'Photo';

    /**
     * État du composant
     */
    @Input()
    public disabled = false;

    public imageChangedEvent: any = '';

    public imageToCropp: String;

    public isImageLoaded = false;

    @Input()
    public isRounded = true;

    public isVisible = false;

    /**
     * Authoriser uniquement les réductions de taille.
     */
    @Input()
    public onlyScaleDown = true;

    /**
     * Redimenssioner automatiquement vers la largeur.
     */
    @Input()
    public resizeToWidth = 1024;

    /**
     * Événement déclenché lors du changement de valeur (nécessaire pour ngModel)
     */
    @Output()
    public valueChange = new EventEmitter<CustomFile>();

    /**
     * Abonnement au focus monitor
     */
    private _focusMonitorSubscription: Subscription;

    /**
     * Fichier à uploader
     */
    private _value: CustomFile;

    @Input()
    public get value(): CustomFile {
        return this._value;
    }

    public set value(value: CustomFile) {
        if (this._value !== value) {
            this._value = value;
            this.valueChange.emit(this.value);
        }
    }

    public constructor(
        /**
         * Service de surveillance du focus d'un élément
         */
        private _focusMonitor: FocusMonitor,

        /**
         * Référence DOM de l'élément
         */
        private _elementRef: ElementRef
    ) {}

    /**
     * Met à jour la valeur suite à un changement depuis l'UI
     */
    public changeValue(value: CustomFile): void {
        if (this.value !== value) {
            this.value = value;
            this.onChange(this.value);
            this.imageToCropp = value ? value.content : null;
            this.isVisible = true;
        }
    }

    public fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    /**
     * Voir : https://www.npmjs.com/package/ngx-image-cropper#outputs
     */
    public imageCropped(event: ImageCroppedEvent) {
        this.value.content = event.base64;
    }

    public modalClosed(): void {
        this.isVisible = false;
        this.isImageLoaded = false;
    }

    /**
     * Suppression des écouteurs d'événements
     */
    public ngOnDestroy(): void {
        this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
        this._focusMonitorSubscription.unsubscribe();
    }

    /**
     * Abonnement au focus du composant
     */
    public ngOnInit(): void {
        this._focusMonitorSubscription = this._focusMonitor
            .monitor(this._elementRef.nativeElement, true)
            .subscribe((origin) => {
                if (origin == null) {
                    this.onTouched();
                }
            });
    }

    public onCancel(): void {
        this.value = null;
        this.onChange(this.value);
        this.isVisible = false;
        this.imageCropped = null;
    }

    /**
     * Mise en place d'un écouteur sur l'événement change
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Mise en place d'un écouteur sur l'événement touched
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Met à jour l'état de visibilité du composant
     */
    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Mise à jour de la propriété value du composant
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

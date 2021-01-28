import { Subject } from 'rxjs';
import { PossibleDropzone } from './possible-dropzone';

export const dropzoneRegistry = new Map<HTMLElement, Dropzone>();

/**
 * Classe transformant un élément DOM en zone de dépôt pour un draggable
 */
export class Dropzone implements PossibleDropzone {
    /**
     * Identifiant permettant de contraindre un ensemble
     * de draggables/dropzones à fonctionner ensemble
     */
    public containerId: string;

    public get element(): HTMLElement {
        return this._element;
    }

    /**
     * Permet d'élargir la zone (element + proximityThreshold)
     * sur laquelle on peut déposer un draggable pour cet objet
     */
    public proximityThreshold = 0;

    private _destroy = new Subject<void>();

    public constructor(private _element: HTMLElement) {
        if (dropzoneRegistry.has(this._element)) {
            return dropzoneRegistry.get(this._element);
        }

        dropzoneRegistry.set(this._element, this);
    }

    public destroy(): void {
        dropzoneRegistry.delete(this._element);

        this._destroy.next();
        this._destroy.complete();
    }
}

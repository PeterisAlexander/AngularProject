/**
 * Décrit un objet sur lequel on peut déposer un élément draggable
 */
export interface PossibleDropzone {
    /**
     * Identifiant permettant de contraindre un ensemble
     * de draggables/dropzones à fonctionner ensemble
     */
    containerId: string;
    element: HTMLElement;
    /**
     * Permet d'élargir la zone (element + proximityThreshold)
     * sur laquelle on peut déposer un draggable pour cet objet
     */
    proximityThreshold: number;
}

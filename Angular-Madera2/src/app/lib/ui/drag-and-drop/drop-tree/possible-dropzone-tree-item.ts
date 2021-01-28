import { PossibleDropzone } from '../drag-and-drop/possible-dropzone';

/**
 * Décrit un objet sur lequel on peut déposer un élément draggable dans une arborescence
 */
export interface PossibleDropzoneTreeItem extends PossibleDropzone {
    indent: number;
    index: number;
}

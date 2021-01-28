import { Input, Directive, ElementRef, OnDestroy } from '@angular/core';
import { Dropzone } from '../drag-and-drop/dropzone';
import { PossibleDropzoneTreeItem } from './possible-dropzone-tree-item';

export interface DropzoneTreeItemPlaceholderStyleModel {
    height: string;
    marginLeft: string;
}

/**
 * Classe transformant un élément DOM en zone de dépôt pour un draggable dans une arborescence
 */
@Directive({
    selector: '[appDropzoneTreeItem]',
    exportAs: 'appDropzoneTreeItem',
})
export class DropzoneTreeItemDirective
    extends Dropzone
    implements PossibleDropzoneTreeItem, OnDestroy {
    @Input()
    public indent = 0;

    public index: number;

    public placeholderStyles: DropzoneTreeItemPlaceholderStyleModel = {
        height: '',
        marginLeft: '',
    };

    public constructor(elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    public ngOnDestroy(): void {
        this.destroy();
    }
}

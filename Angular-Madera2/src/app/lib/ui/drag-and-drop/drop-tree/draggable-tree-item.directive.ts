import { Directive, Input, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DraggableDirective } from '../drag-and-drop/draggable.directive';
import { DragDrop } from '@angular/cdk/drag-drop';
import { PossibleDropzoneTreeItem } from './possible-dropzone-tree-item';
import { DropTreeManagerService } from './drop-tree-manager.service';

/**
 * Classe transformant un élément DOM en élément déplaçable et déposable dans une arborescence
 */
@Directive({
    selector: '[appDraggableTreeItem]',
    exportAs: 'appDraggableTreeItem',
})
export class DraggableTreeItemDirective
    extends DraggableDirective
    implements PossibleDropzoneTreeItem, OnDestroy, OnInit {
    @Input()
    public indent = 0;

    public index: number;

    public constructor(
        private _dropTreeManager: DropTreeManagerService,
        elementRef: ElementRef,
        dragDrop: DragDrop
    ) {
        super(elementRef.nativeElement, dragDrop.createDrag(elementRef));
    }

    public getChildren(directChildren = true): DraggableTreeItemDirective[] {
        throw new Error(
            `La méthode getChildren() doit être implémentée par le DropTreeDirective car seul lui connait la liste des DraggableTreeItem`
        );
    }

    public ngOnDestroy(): void {
        this._dropTreeManager.removeDraggable(this);
        this.destroy();
    }

    public ngOnInit(): void {
        this._dropTreeManager.addDraggable(this);
    }
}

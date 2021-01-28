import { Injectable, OnDestroy } from '@angular/core';
import { first } from 'lodash';
import { merge, race, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { DraggableTreeItemDirective } from './draggable-tree-item.directive';
import { DropTreeDirective } from './drop-tree.directive';
import { PossibleDropzoneTreeItem } from './possible-dropzone-tree-item';

@Injectable({
    providedIn: 'root',
})
export class DropTreeManagerService implements OnDestroy {
    private _destroy = new Subject<void>();

    private _dropTrees = new Map<string, DropTreeDirective>();

    private _eventCancellers = new Map<
        DraggableTreeItemDirective,
        Subject<void>
    >();

    public addDraggable(draggable: DraggableTreeItemDirective): void {
        if (this.hasDraggable(draggable)) {
            throw new Error('Le draggable est déjà connu du manager');
        }

        const cancelOnRemove = new Subject<void>();

        this._eventCancellers.set(draggable, cancelOnRemove);

        merge(
            draggable.entered.pipe(
                map((e) => e.dropzone as PossibleDropzoneTreeItem),
                tap((d) =>
                    this._dropTrees
                        .get(d.containerId)
                        .handleDragEntered(draggable, d)
                )
            ),
            draggable.leaved.pipe(
                map((e) => e.dropzone as PossibleDropzoneTreeItem),
                tap((d) =>
                    this._dropTrees.get(d.containerId).handleDragLeave(d)
                )
            ),
            draggable.moved.pipe(
                filter((e) => e.dropzones.length > 0),
                map((e) => first(e.dropzones) as PossibleDropzoneTreeItem),
                tap((d) =>
                    this._dropTrees
                        .get(d.containerId)
                        .handleDragMove(draggable, d)
                )
            ),
            draggable.dropped.pipe(
                map((e) => e.dropzone as PossibleDropzoneTreeItem),
                tap((d) =>
                    this._dropTrees.get(d.containerId).handleDrop(draggable, d)
                )
            )
        )
            .pipe(takeUntil(race(cancelOnRemove, this._destroy)))
            .subscribe();
    }

    public addDropTree(dropTree: DropTreeDirective): void {
        if (this.hasDropTree(dropTree)) {
            throw new Error(
                `La directive DropTree avec l'identifiant [${dropTree.containerId}] existe déjà.`
            );
        }

        this._dropTrees.set(dropTree.containerId, dropTree);
    }

    public hasDraggable(draggable: DraggableTreeItemDirective): boolean {
        return this._eventCancellers.has(draggable);
    }

    public hasDropTree(dropTree: DropTreeDirective): boolean {
        return this._dropTrees.has(dropTree.containerId);
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public removeDraggable(draggable: DraggableTreeItemDirective): void {
        if (!this.hasDraggable(draggable)) {
            throw new Error("Le draggable n'est pas connu du manager");
        }

        this._eventCancellers.get(draggable).next();
        this._eventCancellers.get(draggable).complete();
        this._eventCancellers.delete(draggable);
    }

    public removeDropTree(dropTree: DropTreeDirective): void {
        this._dropTrees.delete(dropTree.containerId);
    }
}

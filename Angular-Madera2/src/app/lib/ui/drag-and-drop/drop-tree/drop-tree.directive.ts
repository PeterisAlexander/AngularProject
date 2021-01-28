import {
    Directive,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    QueryList,
    ContentChildren,
    AfterContentInit,
    Renderer2,
} from '@angular/core';
import { merge, of, race, Subject } from 'rxjs';
import { DraggableTreeItemDirective } from './draggable-tree-item.directive';
import { DropzoneTreeItemDirective } from './dropzone-tree-item.directive';
import { mapTo, takeUntil } from 'rxjs/operators';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { flatten, last } from 'lodash';
import { PossibleDropzoneTreeItem } from './possible-dropzone-tree-item';
import { v4 as getUniqId } from 'uuid';
import { DropTreeManagerService } from './drop-tree-manager.service';
import { BindInstance } from 'src/app/lib/decorator/bind-instance/bind-instance.decorator';

export interface DropTreeInfoModel {
    count: number;
    nextContainerId: string;
    nextIndent: number;
    nextIndex: number;
    nextIndexBeforeListUpdate: number;
    previousContainerId: string;
    previousIndent: number;
    previousIndex: number;
}

enum cssClasseEnum {
    canDrop = 'dropTree_dropzone-valid',
}

/**
 * Active le drag & drop d'une liste avec arborescence
 */
@Directive({
    selector: '[appDropTree]',
    exportAs: 'appDropTree',
})
export class DropTreeDirective
    implements HandlePropertyChange, OnDestroy, AfterContentInit {
    /**
     * Identifiant qui sera passé aux DraggableTreeItems et DropzoneTreeItems
     * afin de restreindre leur utilisation à cette instance de la DropTreeDirective
     */
    @Input()
    public containerId = getUniqId();

    @Input()
    @ListenPropertyChange()
    public disabled = false;

    @Output()
    public dropped = new EventEmitter<DropTreeInfoModel>();

    @Input()
    public indentSize = 24;

    /**
     * Restreint le drag & drop aux éléments racine,
     * plutôt que d'avoir 2 systèmes de drag & drop (liste et arbre),
     * la liste devient un cas particulier de l'arbre
     */
    @Input()
    public rootOnly = false;

    private _destroy = new Subject<void>();

    @ContentChildren(DraggableTreeItemDirective, { descendants: true })
    private _draggables: QueryList<DraggableTreeItemDirective>;

    @ContentChildren(DropzoneTreeItemDirective, { descendants: true })
    private _dropzones: QueryList<DropzoneTreeItemDirective>;

    private _eventCancellers = new Map<
        DraggableTreeItemDirective,
        Subject<void>
    >();

    public constructor(
        private _dropTreeManager: DropTreeManagerService,
        private _rendered: Renderer2
    ) {}

    @Input()
    public canDrop(dropInfo: DropTreeInfoModel): boolean {
        return true;
    }

    public handleDragEntered(
        dragged: DraggableTreeItemDirective,
        dropzone: PossibleDropzoneTreeItem
    ): void {
        if (
            dropzone instanceof DraggableTreeItemDirective &&
            this.canDropOnDraggable(dragged, dropzone)
        ) {
            this._rendered.addClass(dropzone.element, cssClasseEnum.canDrop);
        }
    }

    public handleDragLeave(dropzone: PossibleDropzoneTreeItem): void {
        if (dropzone instanceof DropzoneTreeItemDirective) {
            dropzone.placeholderStyles = {
                height: '',
                marginLeft: '',
            };
        }

        this._rendered.removeClass(dropzone.element, cssClasseEnum.canDrop);
    }

    public handleDragMove(
        dragged: DraggableTreeItemDirective,
        dropzone: PossibleDropzoneTreeItem
    ): void {
        if (
            dropzone == null ||
            dropzone instanceof DraggableTreeItemDirective
        ) {
            return;
        }

        const indentDiff = this.getIndentDiff(dragged, dropzone);

        if (indentDiff == null) {
            this._rendered.removeClass(dropzone.element, cssClasseEnum.canDrop);
            return;
        }

        this._rendered.addClass(dropzone.element, cssClasseEnum.canDrop);

        if (dropzone instanceof DropzoneTreeItemDirective) {
            const newIndent = dropzone.indent + indentDiff;
            const draggedBoundingBox = dragged.element.getBoundingClientRect();

            dropzone.placeholderStyles = {
                height: `${draggedBoundingBox.height}px`,
                marginLeft: `${newIndent * this.indentSize}px`,
            };
        }
    }

    public handleDrop(
        dragged: DraggableTreeItemDirective,
        dropzone: PossibleDropzoneTreeItem
    ): void {
        let newIndent: number;

        if (dropzone instanceof DraggableTreeItemDirective) {
            const realTarget = this.getDropOnDraggableRealTarget(
                dragged,
                dropzone
            );

            if (realTarget == null) {
                return;
            }

            ({ indent: newIndent, dropzone } = realTarget);

            if (dropzone == null) {
                return;
            }
        }

        if (dropzone instanceof DropzoneTreeItemDirective) {
            const indentDiff = this.getIndentDiff(dragged, dropzone);

            if (indentDiff == null) {
                return;
            }

            newIndent = dropzone.indent + indentDiff;

            dropzone.placeholderStyles = {
                height: '',
                marginLeft: '',
            };
        }

        this.dropped.emit(this.getDropInfo(dragged, dropzone, newIndent));
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.disabled) {
            this.disableDraggables(this.disabled);
        }
    }

    public ngAfterContentInit(): void {
        this._dropTreeManager.addDropTree(this);

        this.initDraggables();
        this.initDropzones();
    }

    public ngOnDestroy(): void {
        this._dropTreeManager.removeDropTree(this);

        this._destroy.next();
        this._destroy.complete();
    }

    private canDropInternal(dropInfo: DropTreeInfoModel): boolean {
        if (this.rootOnly && dropInfo.nextIndent !== 0) {
            return false;
        }

        return this.canDrop(dropInfo);
    }

    private canDropOnDraggable(
        dragged: DraggableTreeItemDirective,
        droppedOn: DraggableTreeItemDirective
    ): boolean {
        return this.getDropOnDraggableRealTarget(dragged, droppedOn) != null;
    }

    private cleanDraggablesSubscriptions(): void {
        Array.from(this._eventCancellers.entries())
            .filter(
                ([draggable]) => !this._draggables.some((d) => d === draggable)
            )
            .forEach(([draggable, cancelOnRemove]) => {
                cancelOnRemove.next();
                cancelOnRemove.complete();
                this._eventCancellers.delete(draggable);
            });
    }

    private disableDraggables(disabled: boolean): void {
        (this._draggables || []).forEach((d) => (d.disabled = disabled));
    }

    @BindInstance()
    private getChildren(
        draggable: DraggableTreeItemDirective,
        directChildren = true
    ): DraggableTreeItemDirective[] {
        const draggables = this._draggables.toArray();
        const index = draggable.index;
        const indent = draggable.indent;
        const result = [];

        for (let i = index + 1; i < draggables.length; i++) {
            if (indent >= draggables[i].indent) {
                break;
            }

            if (!directChildren || draggables[i].indent + 1 === indent) {
                result.push(draggables[i]);
            }
        }

        return result;
    }

    private getDropInfo(
        dragged: DraggableTreeItemDirective,
        droppedOn: PossibleDropzoneTreeItem,
        nextIndent: number
    ): DropTreeInfoModel {
        const count = dragged.getChildren(false).length + 1;
        const previousIndex = dragged.index;
        const nextIndexBeforeListUpdate =
            droppedOn.index +
            (droppedOn instanceof DropzoneTreeItemDirective ? 0 : 1);

        const nextIndex =
            nextIndexBeforeListUpdate -
            (dragged.containerId === droppedOn.containerId &&
            nextIndexBeforeListUpdate > previousIndex
                ? count
                : 0);

        return {
            count,
            nextContainerId: droppedOn.containerId,
            nextIndent,
            nextIndex,
            nextIndexBeforeListUpdate,
            previousContainerId: dragged.containerId,
            previousIndent: dragged.indent,
            previousIndex,
        };
    }

    private getDropOnDraggableRealTarget(
        dragged: DraggableTreeItemDirective,
        droppedOn: DraggableTreeItemDirective
    ): { dropzone: DraggableTreeItemDirective; indent: number } {
        const lastChild = last(droppedOn.getChildren(false));
        let nextIndent = droppedOn.indent + 1;

        if (lastChild != null) {
            droppedOn = lastChild;
            nextIndent = droppedOn.indent;
        }

        return this.canDropInternal(
            this.getDropInfo(dragged, droppedOn, nextIndent)
        )
            ? { indent: nextIndent, dropzone: droppedOn }
            : null;
    }

    private getIndentDiff(
        draggable: DraggableTreeItemDirective,
        dropzone: PossibleDropzoneTreeItem
    ): number {
        const dropzoneIndex = dropzone.index;
        const dropzoneRealIndex =
            dropzoneIndex -
            (dropzone instanceof DropzoneTreeItemDirective ? 1 : 0);

        const draggables = this._draggables.toArray();
        const nextVisible = draggables
            .slice(dropzoneRealIndex + 1)
            .find((d) => !d.element.classList.contains('hidden'));

        const maxIndent =
            dropzone.indent +
            (draggable.index === dropzoneRealIndex || dropzoneRealIndex === -1
                ? 0
                : 1);

        const minIndent = nextVisible != null ? nextVisible.indent : 0;

        let possiblesIndents = [];

        for (let i = minIndent; i <= maxIndent; i++) {
            possiblesIndents.push(i);
        }

        possiblesIndents = possiblesIndents.filter((current) => {
            return this.canDropInternal(
                this.getDropInfo(draggable, dropzone, current)
            );
        });

        if (possiblesIndents.length === 0) {
            return null;
        }

        const draggedDistanceX =
            draggable.element.getBoundingClientRect().left -
            dropzone.element.getBoundingClientRect().left;

        let indent = Math.ceil(draggedDistanceX / this.indentSize) - 1;
        indent = [
            possiblesIndents[0],
            possiblesIndents[possiblesIndents.length - 1],
            indent,
        ].sort((a, b) => a - b)[1];

        return indent - dropzone.indent;
    }

    private initDraggable(
        draggable: DraggableTreeItemDirective,
        index: number
    ): void {
        draggable.disabled = this.disabled;
        draggable.index = index;

        if (this._eventCancellers.has(draggable)) {
            return;
        }

        draggable.containerId = draggable.containerId || this.containerId;
        draggable.isDraggingOutOfFlow = true;
        draggable.isPossibleDropzone = true;
        draggable.oneDropAtTime = true;
        draggable.retainPosition = false;
        draggable.getChildren = (directChildren) =>
            this.getChildren(draggable, directChildren);

        if (draggable.authorizedContainerIds.length === 0) {
            draggable.authorizedContainerIds = [draggable.containerId];
        }

        const cancelOnRemove = new Subject<void>();
        this._eventCancellers.set(draggable, cancelOnRemove);

        merge(
            draggable.started.pipe(mapTo(true)),
            draggable.ended.pipe(mapTo(false))
        )
            .pipe(takeUntil(race(cancelOnRemove, this._destroy)))
            .subscribe((isDragged) =>
                this.toggleDraggableDisplay(draggable, isDragged)
            );
    }

    private initDraggables(): void {
        merge(of(null), this._draggables.changes)
            .pipe(takeUntil(this._destroy))
            .subscribe(() => {
                this.cleanDraggablesSubscriptions();
                this._draggables.forEach((d, i) => this.initDraggable(d, i));
            });
    }

    private initDropzone(
        dropzone: DropzoneTreeItemDirective,
        index: number
    ): void {
        dropzone.containerId = this.containerId;
        dropzone.index = index;
        dropzone.proximityThreshold = 4;
    }

    private initDropzones(): void {
        merge(of(null), this._dropzones.changes)
            .pipe(takeUntil(this._destroy))
            .subscribe(() =>
                this._dropzones.forEach((d, i) => this.initDropzone(d, i))
            );
    }

    private toggleDraggableDisplay(
        draggable: DraggableTreeItemDirective,
        isDragged: boolean
    ): void {
        const getDropzone = (
            reference: DraggableTreeItemDirective
        ): DropzoneTreeItemDirective => {
            return this._dropzones.toArray()[reference.index + 1];
        };

        const dropzone = getDropzone(draggable);

        [
            dropzone.element,
            ...flatten(
                draggable
                    .getChildren(false)
                    .map((d) => [d.element, getDropzone(d).element])
            ),
        ].forEach((e) => e.classList.toggle('hidden', isDragged));
    }
}

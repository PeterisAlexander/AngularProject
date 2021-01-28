import { DragRef, CdkDragHandle } from '@angular/cdk/drag-drop';
import {
    EventEmitter,
    ContentChild,
    ElementRef,
    Directive,
    Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { dropzoneRegistry } from './dropzone';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { without, uniq, last, first } from 'lodash';
import { PossibleDropzone } from './possible-dropzone';

export const draggableRegistry = new Map<HTMLElement, DraggableDirective>();

export interface DraggableDroppedEventModel {
    dropzone: PossibleDropzone;
}

export interface DraggableEndedEventModel {
    distance: { x: number; y: number };
}

export interface DraggableEnteredEventModel {
    dropzone: PossibleDropzone;
}

export interface DraggableLeavedEventModel {
    dropzone: PossibleDropzone;
}

export interface DraggableMovedEventModel {
    delta: { x: -1 | 0 | 1; y: -1 | 0 | 1 };
    distance: { x: number; y: number };
    dropzones: PossibleDropzone[];
    event: MouseEvent | TouchEvent;
    pointerPosition: Point;
}

enum cssClasseEnum {
    entered = 'dropzone-hover',
    started = 'draggable-dragged',
}

/**
 * Classe transformant un élément DOM en élément déplaçable et déposable
 * sur une dropzone (ce que ne gère pas le CdkDragRef)
 */
@Directive()
export abstract class DraggableDirective
    implements HandlePropertyChange, PossibleDropzone {
    @Input()
    public authorizedContainerIds: string[] = [];

    /**
     * Identifiant permettant de contraindre un ensemble
     * de draggables/dropzones à fonctionner ensemble
     */
    public containerId: string;

    @ListenPropertyChange()
    public disabled = false;

    public dropped = new EventEmitter<DraggableDroppedEventModel>();

    public get element(): HTMLElement {
        return this._element;
    }

    public ended = new EventEmitter<DraggableEndedEventModel>();

    public entered = new EventEmitter<DraggableEnteredEventModel>();

    /**
     * Indique si lors du drag, l'élément doit être sorti du flux ou non
     * (par défaut, c'est un simple translate css, l'élément reste dans le flux)
     */
    public isDraggingOutOfFlow = false;

    /**
     * Indique si l'élément peut-être lui aussi une zone de dépôt
     * (ex d'utilisation dans le drag & drop en arborescence)
     */
    public isPossibleDropzone = false;

    public leaved = new EventEmitter<DraggableLeavedEventModel>();

    public moved = new EventEmitter<DraggableMovedEventModel>();

    /**
     * Indique si lorsque l'élément survole plusieurs zones de dépôt
     * si toutes les zones doivent être active ou si une seule doit être privilégiée
     */
    public oneDropAtTime = false;

    /**
     * Permet d'élargir la zone (element + proximityThreshold)
     * sur laquelle on peut déposer un draggable pour cet objet
     */
    public proximityThreshold = 0;

    public released = new EventEmitter<void>();

    /**
     * Indique si à la fin d'un déplacement, la position de l'élément
     * doit être conservée où s'il doit revenir en position initiale
     */
    public retainPosition = true;

    public started = new EventEmitter<void>();

    private _destroy = new Subject<void>();

    @ContentChild(CdkDragHandle, { read: ElementRef })
    @ListenPropertyChange()
    private _handle: ElementRef<HTMLElement>;

    /**
     * Uniquement si oneDropAtTime === true
     * Cette liste contient les zones de dépôt qui ne sont pas
     * la zone privilégiée (et donc l'unique zone active)
     */
    private _ignoredDropzones: PossibleDropzone[] = [];

    private _initialCssPosition: string;

    private _initialCssTop: string;

    private _initialCssWidth: string;

    private _intersectedDropzones: PossibleDropzone[] = [];

    public constructor(
        private _element: HTMLElement,
        private _dragRef: DragRef
    ) {
        if (draggableRegistry.has(this.element)) {
            return draggableRegistry.get(this.element);
        }

        draggableRegistry.set(this.element, this);

        this.listenDragEvents();
    }

    public destroy(): void {
        this._dragRef.dispose();

        draggableRegistry.delete(this.element);

        this._destroy.next();
        this._destroy.complete();
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.disabled) {
            this._dragRef.disabled = changes.disabled.currentValue;
        }

        if (changes._handle) {
            if (changes._handle.previousValue != null) {
                this._dragRef.disableHandle(changes._handle.previousValue);
            }

            if (changes._handle.currentValue != null) {
                this._dragRef.withHandles([this._handle]);
            }
        }
    }

    private checkIntersectionWithDropzones(
        pointerPosition: Point
    ): {
        entereds: PossibleDropzone[];
        leaveds: PossibleDropzone[];
    } {
        let entereds: PossibleDropzone[] = [];
        let leaveds: PossibleDropzone[] = [];

        const possibleDropzones = [
            ...dropzoneRegistry.values(),
            ...Array.from(draggableRegistry.values()).filter(
                (d) => d.isPossibleDropzone && d !== this
            ),
        ].filter((d) => this.authorizedContainerIds.includes(d.containerId));

        possibleDropzones.forEach((dropzone) => {
            const hasIntersection = this.hasIntersection(dropzone);

            if (
                hasIntersection &&
                !this._intersectedDropzones.includes(dropzone)
            ) {
                entereds.push(dropzone);
            }

            if (
                !hasIntersection &&
                this._intersectedDropzones.includes(dropzone)
            ) {
                leaveds.push(dropzone);
            }
        });

        const intersectedDropzones = without(
            [...this._intersectedDropzones, ...entereds],
            ...leaveds
        );

        if (this.oneDropAtTime) {
            ({ entereds, leaveds } = this.handleOneDropAtTime(
                pointerPosition,
                intersectedDropzones,
                leaveds
            ));
        }

        this._intersectedDropzones = intersectedDropzones;

        return { entereds, leaveds };
    }

    private getPrivilegedDropzone(
        pointerPosition: Point,
        dropzones: PossibleDropzone[]
    ): PossibleDropzone {
        const pointerPositionX = pointerPosition.x - window.scrollX;
        const pointerPositionY = pointerPosition.y - window.scrollY;

        // la zone de dépôt privéligiée est la zone qui au mieux est la dernière
        // à être survollée par le curseur, si aucune n'est survollée par le curseur,
        // c'est la dernière zone survollée par l'élément déplacé

        const dropzonesWithPointer = dropzones.filter((dropzone) => {
            const boundingBox = dropzone.element.getBoundingClientRect();

            return (
                pointerPositionY >=
                    boundingBox.top - dropzone.proximityThreshold &&
                pointerPositionY <=
                    boundingBox.bottom + dropzone.proximityThreshold &&
                pointerPositionX >=
                    boundingBox.left - dropzone.proximityThreshold &&
                pointerPositionX <=
                    boundingBox.right + dropzone.proximityThreshold
            );
        });

        return last(
            dropzonesWithPointer.length > 0 ? dropzonesWithPointer : dropzones
        );
    }

    private handleDragEnd(end: { distance: Point; source: DragRef }): void {
        if (this.isDraggingOutOfFlow) {
            this.element.style.position = this._initialCssPosition;
            this.element.style.width = this._initialCssWidth;
            this.element.style.top = this._initialCssTop;
        }

        this.element.classList.remove(cssClasseEnum.started);

        if (!this.retainPosition) {
            this._dragRef.reset();
        }

        without(this._intersectedDropzones, ...this._ignoredDropzones).forEach(
            (dropzone) => {
                dropzone.element.classList.remove(cssClasseEnum.entered);
                this.dropped.emit({ dropzone });
            }
        );

        this._intersectedDropzones = [];
        this._ignoredDropzones = [];

        this.ended.emit(this.mapToEndedEventModel(end));
    }

    private handleDragEnter(dropzone: PossibleDropzone): void {
        dropzone.element.classList.add(cssClasseEnum.entered);
        this.entered.emit({ dropzone });
    }

    private handleDragLeave(dropzone: PossibleDropzone): void {
        dropzone.element.classList.remove(cssClasseEnum.entered);
        this.leaved.emit({ dropzone });
    }

    private handleDragMove(move: {
        delta: { x: -1 | 0 | 1; y: -1 | 0 | 1 };
        distance: { x: number; y: number };
        event: MouseEvent | TouchEvent;
        pointerPosition: Point;
        source: DragRef;
    }): void {
        const { entereds, leaveds } = this.checkIntersectionWithDropzones(
            move.pointerPosition
        );

        this.moved.emit(this.mapToMovedEventModel(move));

        entereds.forEach((d) => this.handleDragEnter(d));
        leaveds.forEach((d) => this.handleDragLeave(d));
    }

    private handleDragStart(): void {
        if (this.isDraggingOutOfFlow) {
            this._initialCssPosition = this.element.style.position;
            this._initialCssWidth = this.element.style.width;
            this._initialCssTop = this.element.style.top;

            const boundingBox = this.element.getBoundingClientRect();

            this.element.style.width = `${boundingBox.width}px`;
            this.element.style.top = `${boundingBox.top}px`;
            this.element.style.position = 'fixed';
        }

        this.element.classList.add(cssClasseEnum.started);
        this.started.emit();
    }

    private handleOneDropAtTime(
        pointerPosition: Point,
        intersectedDropzones: PossibleDropzone[],
        leaveds: PossibleDropzone[]
    ): { entereds: PossibleDropzone[]; leaveds: PossibleDropzone[] } {
        let currentPriviligedDropzone = first(
            without(this._intersectedDropzones, ...this._ignoredDropzones)
        );

        const newPriviligedDropzone = this.getPrivilegedDropzone(
            pointerPosition,
            intersectedDropzones
        );

        const entereds =
            newPriviligedDropzone == null ? [] : [newPriviligedDropzone];

        if (
            newPriviligedDropzone &&
            currentPriviligedDropzone !== newPriviligedDropzone
        ) {
            if (currentPriviligedDropzone) {
                leaveds = uniq([...leaveds, currentPriviligedDropzone]);
            }

            currentPriviligedDropzone = newPriviligedDropzone;
        }

        this._ignoredDropzones = without(
            this._intersectedDropzones,
            currentPriviligedDropzone
        );

        return { entereds, leaveds };
    }

    private hasIntersection(dropzone: PossibleDropzone): boolean {
        const dropzoneBoundingBox = dropzone.element.getBoundingClientRect();
        const draggableBoundingBox = this.element.getBoundingClientRect();
        const noIntersection =
            draggableBoundingBox.top >
                dropzoneBoundingBox.bottom + dropzone.proximityThreshold ||
            draggableBoundingBox.bottom <
                dropzoneBoundingBox.top - dropzone.proximityThreshold ||
            draggableBoundingBox.left >
                dropzoneBoundingBox.right + dropzone.proximityThreshold ||
            draggableBoundingBox.right <
                dropzoneBoundingBox.left - dropzone.proximityThreshold;

        return !noIntersection;
    }

    private listenDragEvents(): void {
        this._dragRef.started
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.handleDragStart());

        this._dragRef.released
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.released.emit());

        this._dragRef.moved
            .pipe(takeUntil(this._destroy))
            .subscribe((m) => this.handleDragMove(m));

        this._dragRef.ended
            .pipe(takeUntil(this._destroy))
            .subscribe((e) => this.handleDragEnd(e));
    }

    private mapToEndedEventModel(end: {
        distance: Point;
        source: DragRef;
    }): DraggableEndedEventModel {
        return { distance: end.distance };
    }

    private mapToMovedEventModel(move: {
        delta: { x: -1 | 0 | 1; y: -1 | 0 | 1 };
        distance: { x: number; y: number };
        event: MouseEvent | TouchEvent;
        pointerPosition: Point;
        source: DragRef;
    }): DraggableMovedEventModel {
        return {
            delta: move.delta,
            distance: move.distance,
            dropzones: without(
                this._intersectedDropzones,
                ...this._ignoredDropzones
            ),
            event: move.event,
            pointerPosition: move.pointerPosition,
        };
    }
}

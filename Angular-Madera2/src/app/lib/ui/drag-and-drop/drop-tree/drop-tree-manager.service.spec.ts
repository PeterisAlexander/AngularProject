import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
    DraggableDroppedEventModel,
    DraggableEnteredEventModel,
    DraggableLeavedEventModel,
    DraggableMovedEventModel,
} from '../drag-and-drop/draggable.directive';
import { DraggableTreeItemDirective } from './draggable-tree-item.directive';
import { DropTreeManagerService } from './drop-tree-manager.service';
import { v4 as getUniqId } from 'uuid';
import { DropTreeDirective } from './drop-tree.directive';
import { PossibleDropzone } from '../drag-and-drop/possible-dropzone';

function getDraggable(): DraggableTreeItemDirective {
    return {
        dropped: new EventEmitter<DraggableDroppedEventModel>(),
        entered: new EventEmitter<DraggableEnteredEventModel>(),
        leaved: new EventEmitter<DraggableLeavedEventModel>(),
        moved: new EventEmitter<DraggableMovedEventModel>(),
    } as DraggableTreeItemDirective;
}

function getDropTree(): DropTreeDirective {
    const dropTree = jasmine.createSpyObj<DropTreeDirective>(
        'DropTreeDirective',
        ['handleDragEntered', 'handleDragLeave', 'handleDragMove', 'handleDrop']
    );
    dropTree.containerId = getUniqId();

    return dropTree;
}

describe('DropTreeManager', () => {
    let service: DropTreeManagerService;

    beforeEach(() => {
        service = TestBed.inject(DropTreeManagerService);
    });

    it('doit se créer', () => {
        expect(service).toBeTruthy();
    });

    it('addDraggable doit ajouter un draggable au manager', () => {
        const draggable = getDraggable();

        expect(service.hasDraggable(draggable)).toBeFalsy();
        service.addDraggable(draggable);
        expect(service.hasDraggable(draggable)).toBeTruthy();
    });

    it('removeDraggable doit supprimer un draggable au manager', () => {
        const draggable = getDraggable();

        service.addDraggable(draggable);
        expect(service.hasDraggable(draggable)).toBeTruthy();
        service.removeDraggable(draggable);
        expect(service.hasDraggable(draggable)).toBeFalsy();
    });

    it('addDropTree doit ajouter un dropTree au manager', () => {
        const dropTree = getDropTree();

        expect(service.hasDropTree(dropTree)).toBeFalsy();
        service.addDropTree(dropTree);
        expect(service.hasDropTree(dropTree)).toBeTruthy();
    });

    it('removeDropTree doit supprimer un dropTree au manager', () => {
        const dropTree = getDropTree();

        service.addDropTree(dropTree);
        expect(service.hasDropTree(dropTree)).toBeTruthy();
        service.removeDropTree(dropTree);
        expect(service.hasDropTree(dropTree)).toBeFalsy();
    });

    it("À chaque événement du draggable, l'action correspondante du dropTree est appelée", (done) => {
        const dropTree = getDropTree();
        service.addDropTree(dropTree);

        const draggable = getDraggable();
        service.addDraggable(draggable);

        draggable.dropped.emit({
            dropzone: { containerId: dropTree.containerId } as PossibleDropzone,
        });

        draggable.entered.emit({
            dropzone: { containerId: dropTree.containerId } as PossibleDropzone,
        });

        draggable.leaved.emit({
            dropzone: { containerId: dropTree.containerId } as PossibleDropzone,
        });

        draggable.moved.emit({
            dropzones: [
                { containerId: dropTree.containerId } as PossibleDropzone,
            ],
        } as DraggableMovedEventModel);

        setTimeout(() => {
            expect(dropTree.handleDragEntered).toHaveBeenCalled();
            expect(dropTree.handleDragLeave).toHaveBeenCalled();
            expect(dropTree.handleDragMove).toHaveBeenCalled();
            expect(dropTree.handleDrop).toHaveBeenCalled();

            done();
        }, 100);
    });
});

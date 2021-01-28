import { Component } from '@angular/core';
import { DropzoneTreeItemDirective } from '../../drag-and-drop/drop-tree/dropzone-tree-item.directive';

@Component({
    selector: 'app-list-dropzone',
    templateUrl: './list-dropzone.component.html',
    styleUrls: ['./list-dropzone.component.css']
})
export class ListDropzoneComponent {
    public constructor(public dropzoneTreeItem: DropzoneTreeItemDirective) {}
}

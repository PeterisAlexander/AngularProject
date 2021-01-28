import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    Optional,
} from '@angular/core';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    EditorComponent,
    QuillEditorCreatedModel,
} from '../editor/editor.component';
import {
    MergeFieldInsertModel,
    MergeFieldService,
} from './merge-field.service';
import { v4 as generateUuid } from 'uuid';
import { Template } from '../editor/template/template';

@Directive({
    selector: '[appMergeFieldInput]',
})
export class MergeFieldInputDirective implements OnDestroy, OnInit {
    @Input('appMergeFieldInput')
    public insert: MergeFieldInsertModel;

    private _destroy = new Subject<void>();

    private _id = generateUuid();

    public constructor(
        @Optional()
        private _element: ElementRef,
        @Optional()
        private _input: NzInputDirective,
        private _mergeField: MergeFieldService,
        @Optional()
        private _quill: EditorComponent,
        @Optional()
        private _select: NzSelectComponent
    ) {}

    public ngOnDestroy(): void {
        this._mergeField.removeInput(this._id);

        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this.addAppropriateInput();
    }

    private addAppropriateInput(): void {
        if (this._quill) {
            this._quill.editorCreated
                .pipe(takeUntil(this._destroy))
                .subscribe((editorCreated) => {
                    this.addQuillEditor(editorCreated);
                });
        } else if (this._input) {
            this.addInput();
        } else if (this._select) {
            this.addSelect();
        }
    }

    private addInput(): void {
        this._mergeField.addInput({
            id: this._id,
            focus: fromEvent(this._element.nativeElement, 'focus'),
            insert: this.insert,
        });
    }

    private addQuillEditor(editorCreated: QuillEditorCreatedModel): void {
        const templateModule: Template = editorCreated.editor.getModule(
            'template'
        );
        this._mergeField.addInput({
            id: this._id,
            focus: editorCreated.component.onFocus,
            insert: (key, isMail) => {
                templateModule.insertMergeField(key);
            },
        });
    }

    private addSelect(): void {
        this._mergeField.addInput({
            id: this._id,
            focus: this._select.nzFocus,
            insert: this.insert,
        });
    }
}

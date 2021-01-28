import { Injectable } from '@angular/core';
import { remove } from 'lodash';
import { Focus } from 'ngx-quill';
import { Observable, Subscription } from 'rxjs';

export type MergeFieldInsertModel = (key: string, isMail: boolean) => void;

export interface MergeFieldInputModel {
    focus: Observable<void | Focus>;
    focusListener?: Subscription;
    id: string;
    insert: MergeFieldInsertModel;
}

@Injectable({
    providedIn: 'root',
})
export class MergeFieldService {
    public get activeInput(): MergeFieldInputModel {
        return this._activeInput;
    }

    private _activeInput: MergeFieldInputModel;

    private _inputs: MergeFieldInputModel[] = [];

    public addInput(input: MergeFieldInputModel): void {
        input.focusListener = input.focus.subscribe(() => {
            this._activeInput = input;
        });

        this._inputs.push(input);
    }

    public hasInput(id: string): boolean {
        return this._inputs.some((i) => i.id === id);
    }

    public insert(value: string, isMail = false): void {
        this._activeInput?.insert(value, isMail);
    }

    public removeInput(inputId: string): void {
        const editor = this._inputs.find((e) => e.id === inputId);

        if (editor.focusListener && !editor.focusListener.closed) {
            editor.focusListener.unsubscribe();
        }

        if (editor.id === this._activeInput?.id) {
            this._activeInput = null;
        }

        remove(this._inputs, (e) => e.id === inputId);
    }
}

import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { isArray, isString } from 'lodash';
import { NzOptionComponent } from 'ng-zorro-antd/select';
import { ListenPropertyChange } from '../../../decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from '../../../decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from '../../../decorator/property-change/change-by-property.model';

export interface OptionContentColumnModel {
    align?: 'left' | 'center' | 'right';
    indent?: number;
    label: string;
    width?: string;
}

interface TemplateDataModel {
    $implicit?: any;
    [property: string]: any;
}

export type OptionContentColumnListModel = OptionContentColumnModel[];

@Component({
    selector: 'app-option-content',
    templateUrl: './option-content.component.html',
    styleUrls: ['./option-content.component.css'],
})
export class OptionContentComponent implements HandlePropertyChange, OnInit {
    @Input()
    @ListenPropertyChange()
    public content: string | OptionContentColumnListModel;

    public contentStr = '';

    public isOneColumn = true;

    public multiColumnsGrid = '';

    @Input()
    public template: TemplateRef<TemplateDataModel>;

    @Input()
    public templateData: TemplateDataModel = {};

    @Input()
    public tooltipPlacement = 'right';

    public constructor(private _option: NzOptionComponent) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.content) {
            this.handleContentChange();
        }
    }

    public ngOnInit(): void {
        // évite d'oublier de positionner le nzCustomContent sur le nz-option
        // comme cela la mise en forme via le app-option-content est toujours prise en compte
        this._option.nzCustomContent = true;

        // évite de devoir recopier bêtement la valeur du nzLabel du nz-option parent
        if (this.content == null) {
            this.content = this._option.nzLabel;
            this.handleContentChange();
        }
    }

    private handleContentChange(): void {
        this.contentStr = isString(this.content)
            ? this.content
            : isArray(this.content) && this.content.length === 1
            ? this.content[0].label
            : '';

        this.isOneColumn = !isArray(this.content) || this.content.length === 1;

        if (!this.isOneColumn) {
            const columns = this.content as OptionContentColumnListModel;
            this.multiColumnsGrid = columns
                .map((c) => c.width || '1fr')
                .join(' ');
        }
    }
}

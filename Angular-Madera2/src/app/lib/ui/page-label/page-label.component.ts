import {
    Component,
    Input,
    TemplateRef,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { isString } from 'lodash';
import { PageLabelService } from './page-label.service';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';
import { LayoutService } from '../layout/layout.service';

@Component({
    selector: 'app-page-label',
    templateUrl: './page-label.component.html',
    styleUrls: ['./page-label.component.css'],
})
export class PageLabelComponent implements HandlePropertyChange {
    @Input()
    public extraTitle: string | TemplateRef<void>;

    public isString = isString;

    @Input()
    public subtitle: string | TemplateRef<void>;

    @Input()
    @ListenPropertyChange()
    public title: string | TemplateRef<void>;

    @ViewChild('lineTitle')
    private _lineTitle: ElementRef;

    public constructor(
        public pageLabel: PageLabelService,
        private _layout: LayoutService
    ) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.title) {
            this.updatePageTitle();
        }
    }

    private updatePageTitle(): void {
        this._layout.pageTitle.next(this._lineTitle.nativeElement.innerText);
    }
}

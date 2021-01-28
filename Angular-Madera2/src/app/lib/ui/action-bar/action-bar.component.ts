import {
    AfterViewInit,
    Component,
    HostBinding,
    Input,
    Optional,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { NzDrawerComponent } from 'ng-zorro-antd/drawer';

@Component({
    selector: 'app-action-bar',
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.css'],
})
export class ActionBarComponent implements AfterViewInit {
    @Input()
    public bodyClasses = {};

    @Input()
    public bodyStyles = {};

    public get leftPosition(): number {
        return this._layout.isDrawerNav ? 0 : this._layout.navWidth;
    }

    @HostBinding('class.actionBar-inDrawer')
    public get inDrawer(): boolean {
        return this._drawer != null;
    }

    @ViewChild('bodyTpl')
    private _bodyTpl: TemplateRef<{}>;

    public constructor(
        @Optional()
        private _drawer: NzDrawerComponent,
        private _layout: LayoutService
    ) {}

    public ngAfterViewInit(): void {
        this.configureDrawer();
    }

    private configureDrawer(): void {
        if (!this.inDrawer) {
            return;
        }

        this._drawer.nzFooter = this._bodyTpl;
    }
}

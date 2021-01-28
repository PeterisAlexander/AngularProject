import { Component, HostBinding, Input } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
    selector: 'app-layout',
    styleUrls: ['./layout.component.css'],
    templateUrl: './layout.component.html',
})
export class LayoutComponent {
    @HostBinding('class.layout-withFixedHeader')
    private get _hostClassFixedHeader(): boolean {
        return this.withHeader && this._layout.isFixedHeader;
    }

    @HostBinding('class.layout-withFixedNav')
    private get _hostClassFixedNav(): boolean {
        return this.withNav && !this._layout.isDrawerNav;
    }

    @Input()
    public withHeader = false;

    @Input()
    public withNav = false;

    public constructor(private _layout: LayoutService) {}
}

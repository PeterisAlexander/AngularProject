import { Component, Input, HostBinding, TemplateRef } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
    selector: 'app-header-user',
    styleUrls: ['./header-user.component.css'],
    templateUrl: './header-user.component.html',
})
export class HeaderUserComponent {
    @Input()
    public avatar: string;

    @Input()
    public content: TemplateRef<void>;

    @Input()
    public initials: string;

    @Input()
    public name: string;

    @HostBinding('class.headerUser-compact')
    private get _hostClassCompact(): boolean {
        return this._layout.isFixedHeader;
    }

    public constructor(private _layout: LayoutService) {}
}

import { Component, Input, HostBinding } from '@angular/core';
import { LayoutService } from '../layout.service';
import { HeaderBookmarkListModel } from './header-bookmark-list.model';

@Component({
    selector: 'app-header-bookmark-list',
    styleUrls: ['./header-bookmark-list.component.css'],
    templateUrl: './header-bookmark-list.component.html',
})
export class HeaderBookmarkListComponent {
    @Input()
    public list: HeaderBookmarkListModel = [];

    @HostBinding('class.headerBookmarkList-compact')
    private get _hostClassCompact(): boolean {
        return this._layout.isFixedHeader;
    }

    public constructor(private _layout: LayoutService) {}
}

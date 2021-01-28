import { Component, Input, HostBinding, ContentChild } from '@angular/core';

import { TitleComponent } from '../title/title.component';

@Component({
    selector: 'app-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.css'],
})
export class BoxComponent {
    @Input()
    public background = 'var(--gray2)';

    @Input()
    @HostBinding('class.boxComponent-withBoxShadow')
    public boxShadow = true;

    public get hasTitle(): boolean {
        return this._title != null;
    }

    @Input()
    public headerTransparent = false;

    @Input()
    public padding = 'var(--space4)';

    @Input()
    @HostBinding('class.box-withOverflow')
    public withOverflow = true;

    @ContentChild(TitleComponent)
    private _title: TitleComponent;
}

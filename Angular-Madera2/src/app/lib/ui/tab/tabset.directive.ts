import { Directive, HostBinding } from '@angular/core';
import { NzTabSetComponent } from 'ng-zorro-antd/tabs';

@Directive({
    selector: '[appTabset]',
    exportAs: 'appTabset',
})
export class TabsetDirective {
    @HostBinding('class.tabset')
    private _hostClass = true;

    public constructor(public tabSetComponent: NzTabSetComponent) {
        tabSetComponent.nzSize = 'large';
        tabSetComponent.nzTabBarStyle = {
            backgroundColor: 'white',
            padding: '0 24px',
        };
    }
}

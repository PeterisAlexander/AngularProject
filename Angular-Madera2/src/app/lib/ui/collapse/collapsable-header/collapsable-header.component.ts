import { Component, HostListener, Input, HostBinding } from '@angular/core';
import { CollapseHandlerBaseDirective } from '../collapsable/collapse-handler-base.directive';

enum IconSideEnum {
    left = 'left',
    right = 'right',
}

@Component({
    selector: 'app-collapsable-header',
    templateUrl: './collapsable-header.component.html',
    styleUrls: ['./collapsable-header.component.css'],
})
export class CollapsableHeaderComponent extends CollapseHandlerBaseDirective {
    @Input()
    public iconColor = 'var(--neutral4)';

    @Input()
    public iconSide = IconSideEnum.left;

    public get isIconLeft(): boolean {
        return this.iconSide === IconSideEnum.left;
    }

    @Input()
    @HostBinding('style.padding')
    public padding = '0';

    @Input()
    @HostBinding('class.collapsableHeader-withBorder')
    public withBorder = false;

    @HostListener('click')
    public toggleCollapse(): void {
        this.collapsed = !this.collapsed;
    }
}

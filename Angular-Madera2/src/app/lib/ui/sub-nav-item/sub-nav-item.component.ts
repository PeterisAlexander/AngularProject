import { Component, Input, HostBinding, ElementRef } from '@angular/core';
import { RouteModel } from '../../model/route.model';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';

@Component({
    selector: 'app-sub-nav-item',
    templateUrl: './sub-nav-item.component.html',
    styleUrls: ['./sub-nav-item.component.css']
})
export class SubNavItemComponent {
    @HostBinding('class.subNavItem-active')
    public isActive = false;

    @Input()
    @ListenPropertyChange()
    public redirectTo: RouteModel;

    public constructor(public elementRef: ElementRef) {}
}

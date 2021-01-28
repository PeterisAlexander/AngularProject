import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'app-card-status',
    templateUrl: './card-status.component.html',
    styleUrls: ['./card-status.component.css'],
})
export class CardStatusComponent {
    @Input()
    @HostBinding('style.background-color')
    public color = '#FF8057';

    @Input()
    public text: string;

    public constructor() {}
}

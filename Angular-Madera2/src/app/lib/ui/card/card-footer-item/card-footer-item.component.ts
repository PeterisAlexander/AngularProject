import {
    Component,
    Input,
    HostBinding,
    ChangeDetectionStrategy
} from '@angular/core';

@Component({
    selector: 'app-card-footer-item',
    templateUrl: './card-footer-item.component.html',
    styleUrls: ['./card-footer-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFooterItemComponent {
    @Input()
    @HostBinding('class.cardFooterItem-disabled')
    public disabled = false;
}

import { Component, Input } from '@angular/core';
import { LegendItemModel } from './legend-item.model';

enum TypeEnum {
    square = 'square',
    round = 'round'
}

@Component({
    selector: 'app-legende',
    templateUrl: './legende.component.html',
    styleUrls: ['./legende.component.css']
})
export class LegendeComponent {
    @Input()
    public legendElements: LegendItemModel[] = [];

    @Input()
    public legendTitle = 'Légende';

    @Input()
    public type = TypeEnum.square;

    public typeEnum = TypeEnum;
}

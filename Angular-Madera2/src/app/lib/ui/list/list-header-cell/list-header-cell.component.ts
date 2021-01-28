import {
    Component,
    Input,
    TemplateRef,
    ChangeDetectionStrategy
} from '@angular/core';
import { TextALignEnum } from 'src/app/lib/enum/text-align.enum';
import { isString } from 'lodash';

@Component({
    selector: 'app-list-header-cell',
    templateUrl: './list-header-cell.component.html',
    styleUrls: ['./list-header-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListHeaderCellComponent {
    public isString = isString;

    @Input()
    public label: string | TemplateRef<void>;

    @Input()
    public textAlign: TextALignEnum;

    @Input()
    public width: string;
}

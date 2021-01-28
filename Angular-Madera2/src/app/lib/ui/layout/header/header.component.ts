import {
    Component,
    HostBinding,
    TemplateRef,
    Input,
    EventEmitter,
    Output,
} from '@angular/core';
import { LayoutService } from '../layout.service';
import { isString } from 'lodash';

@Component({
    selector: 'app-header',
    styleUrls: ['./header.component.css'],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    @Input()
    public extra: TemplateRef<void>;

    public isString = isString;

    @Output()
    public navClick = new EventEmitter<void>();

    @HostBinding('class.header-fixed')
    private get _hostClassFixed(): boolean {
        return this.layout.isFixedHeader;
    }

    public constructor(public layout: LayoutService) {}
}

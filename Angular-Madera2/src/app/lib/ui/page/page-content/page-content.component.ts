import { Component, Input, HostBinding } from '@angular/core';
import { CssStyleModel } from 'src/app/lib/model/css-style.model';

@Component({
    selector: 'app-page-content',
    templateUrl: './page-content.component.html',
    styleUrls: ['./page-content.component.css']
})
export class PageContentComponent {
    @Input()
    public width: number;

    @HostBinding('style')
    private get _hostStyles(): CssStyleModel {
        if (this.width == null) {
            return {};
        }

        return {
            margin: '0 auto',
            maxWidth: `100%`,
            width: `${this.width}px`
        };
    }
}

import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { isFunction, isString, isArray } from 'lodash';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.css'],
})
export class TileComponent {
    @Input()
    public action: string | string[] | (() => void);

    @Input()
    @HostBinding('style.background-color')
    public background = 'var(--gray2)';

    @Input()
    public border = 'transparent';

    @Input()
    @HostBinding('style.color')
    public color = 'var(--fontColorBase)';

    @Input()
    public icon: string;

    @Input()
    public number: number;

    @HostBinding('style.box-shadow')
    private get _hostStyleBorder(): string {
        return `0px 0px 1px 1px ${this.border}`;
    }

    @HostBinding('class.tile-hasAction')
    private get _hostStylehasAction(): boolean {
        return this.action != null;
    }

    public constructor(private _router: Router) {}

    @HostListener('click')
    private executeAction(): void {
        if (isString(this.action)) {
            this._router.navigateByUrl(this.action);
        } else if (isArray(this.action)) {
            this._router.navigate(this.action);
        } else if (isFunction(this.action)) {
            this.action();
        }
    }
}

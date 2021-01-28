import {
    Component,
    Input,
    TemplateRef,
    HostBinding,
    OnDestroy,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointEnum } from 'src/app/lib/breakpoint/breakpoint.enum';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.css'],
})
export class TitleComponent implements OnDestroy {
    @Input()
    @HostBinding('style.color')
    public color = 'var(--textColor)';

    @Input()
    public extra: TemplateRef<any>;

    public get titleClasses(): { [key: string]: boolean } {
        return {
            'title-card': this.type === 'card',
            'title-cardAlt': this.type === 'cardAlt',
            'title-box': this.type === 'box',
            'title-beforeBox': this.type === 'beforeBox',
            'title-form2': this.type === 'form2',
            'title-form3': this.type === 'form3',
            'title-dashboard': this.type === 'dashboard',
            'title-table': this.type === 'table',
            'title-form1NoBackground': this.type === 'form1NoBackground',
        };
    }

    @Input()
    public get type(): string {
        return this._type;
    }

    public set type(value: string) {
        if (value !== this.type) {
            this._type = value;
        }
    }

    private _destroy = new Subject();

    @HostBinding('class.flexColumn')
    private get _flexColumnClass(): boolean {
        return !this._isDesktop;
    }

    private _isDesktop = false;

    @HostBinding('class.title_container-form3')
    private get _titleContainerForm3Class(): boolean {
        return this.type === 'form3';
    }

    private _type: string;

    public constructor(breakpointObserver: BreakpointObserver) {
        breakpointObserver
            .observe(BreakpointEnum.gtMd)
            .pipe(takeUntil(this._destroy))
            .subscribe((r) => (this._isDesktop = r.matches));
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }
}

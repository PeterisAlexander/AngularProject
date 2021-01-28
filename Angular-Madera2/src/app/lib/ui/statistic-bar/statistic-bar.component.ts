import {
    Component,
    AfterContentInit,
    QueryList,
    ContentChildren,
    OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { BreakpointEnum } from 'src/app/lib/breakpoint/breakpoint.enum';

@Component({
    selector: 'app-statistic-bar',
    templateUrl: './statistic-bar.component.html',
    styleUrls: ['./statistic-bar.component.css'],
})
export class StatisticBarComponent implements AfterContentInit, OnDestroy {
    /**
     * Orientation des dividers (modifié en fonction de la largeur d'écran)
     */
    public dividerOrientation = 'horizontal';

    private _destroy = new Subject<any>();

    /**
     * Liste des dividers
     */
    @ContentChildren(NzDividerComponent)
    private _dividers: QueryList<NzDividerComponent>;

    public constructor(private _breakpointObserver: BreakpointObserver) {}

    public ngAfterContentInit(): void {
        this._breakpointObserver
            .observe(BreakpointEnum.gtMd)
            .pipe(takeUntil(this._destroy))
            .subscribe((r) => {
                this._dividers.forEach(
                    (d) => (d.nzType = r.matches ? 'vertical' : 'horizontal')
                );
            });
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }
}

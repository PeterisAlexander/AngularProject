import {
    Component,
    Input,
    HostBinding,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { BreakpointService } from 'src/app/lib/breakpoint/breakpoint.service';
import { race, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CssStyleModel } from 'src/app/lib/model/css-style.model';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { isNumber, parseInt } from 'lodash';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';

@Component({
    selector: 'app-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent implements HandlePropertyChange, OnDestroy {
    @Input()
    @ListenPropertyChange()
    public gridPattern = 'xs = 1, sm = 2, md = 4, lg = 5, gt-lg = 6';

    @Input()
    @HostBinding('class.cardList-multiColumns')
    public isGrid = true;

    private _cancelCurrentResponsive = new Subject<void>();

    private _destroy = new Subject<void>();

    @HostBinding('style')
    private get _hostStyles(): CssStyleModel {
        return {
            '--cardListNbCards': this._nbCardsByRow,
        };
    }

    private _nbCardsByRow = 1;

    public constructor(
        private _breakpoint: BreakpointService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.gridPattern) {
            this.setResponsive();
        }
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    private setResponsive(): void {
        this._cancelCurrentResponsive.next();

        if (isNumber(this.gridPattern)) {
            this._nbCardsByRow = parseInt(this.gridPattern);
            this._changeDetectorRef.markForCheck();

            return;
        }

        this._breakpoint
            .valueFromBreakpoints(this.gridPattern)
            .pipe(takeUntil(race(this._cancelCurrentResponsive, this._destroy)))
            .subscribe((b) => {
                this._nbCardsByRow = parseInt(b.value);
                this._changeDetectorRef.markForCheck();
            });
    }
}

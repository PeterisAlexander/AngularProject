import {
    Component,
    ContentChildren,
    QueryList,
    Input,
    HostBinding,
    OnDestroy,
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { ListHeaderCellComponent } from '../list-header-cell/list-header-cell.component';
import { CssStyleModel } from 'src/app/lib/model/css-style.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    CardLayoutService,
    CardLayoutModel
} from '../../card/card/card-layout.service';
import { CardModeEnum } from '../../card/card/card-mode.enum';

@Component({
    selector: 'app-list-header',
    templateUrl: './list-header.component.html',
    styleUrls: ['./list-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListHeaderComponent implements OnDestroy, AfterContentInit {
    @ContentChildren(ListHeaderCellComponent)
    private _cells: QueryList<ListHeaderCellComponent>;

    private _destroy = new Subject<void>();

    private _gridTemplateColumns: string;

    @HostBinding('class.hidden')
    private get _hostClassHidden(): boolean {
        return this._layout?.mode === CardModeEnum.card;
    }

    @HostBinding('style')
    private get _hostStyles(): CssStyleModel {
        // évite de voir le composant se construire et "clignoter"
        if (this._layout == null) {
            return { visibility: 'hidden' };
        }

        return {
            '--listHeaderPadding': this._layout.padding,
            '--listHeaderPaddingLeft': this._layout.firstCellPaddingLeft,
            'grid-template-columns': this._gridTemplateColumns
        };
    }

    private _layout: CardLayoutModel;

    public constructor(
        public cardLayout: CardLayoutService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngAfterContentInit(): void {
        this.handleLayout();
        this.initCellsConfig();
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    private handleLayout(): void {
        this.cardLayout.layout
            .pipe(takeUntil(this._destroy))
            .subscribe(layout => {
                this._layout = layout;
                this._changeDetectorRef.markForCheck();

                this.updateGrid();
            });

        this._cells.changes
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.updateGrid());
    }

    private initCellsConfig(): void {
        this.cardLayout.initialCellsConfig.next(
            this._cells.map(c => ({
                label: c.label,
                textAlign: c.textAlign,
                width: c.width
            }))
        );
    }

    private updateGrid(): void {
        this._gridTemplateColumns = this.cardLayout.getGridTemplateColumns(
            this._cells.map(c => c.width)
        );

        this._changeDetectorRef.markForCheck();
    }
}

import {
    Component,
    HostBinding,
    ContentChild,
    QueryList,
    ContentChildren,
    OnDestroy,
    Input,
    AfterContentInit,
    Optional,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    TemplateRef,
} from '@angular/core';
import { CardFooterComponent } from '../card-footer/card-footer.component';
import { CardFooterItemComponent } from '../card-footer-item/card-footer-item.component';
import { CssStyleModel } from 'src/app/lib/model/css-style.model';
import { CardCellComponent } from '../card-cell/card-cell.component';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { RouteModel } from 'src/app/lib/model/route.model';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { CardSizeEnum } from './card-size.enum';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { CollapseHandlerBaseDirective } from '../../collapse/collapsable/collapse-handler-base.directive';
import {
    CardLayoutService,
    CardLayoutModel,
    CardLayoutConfigModel,
} from './card-layout.service';
import { ListComponent } from '../../list/list/list.component';
import { CardModeEnum } from './card-mode.enum';
import { DraggableTreeItemDirective } from '../../drag-and-drop/drop-tree/draggable-tree-item.directive';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    providers: [CardLayoutService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent
    extends CollapseHandlerBaseDirective
    implements AfterContentInit, OnDestroy, HandlePropertyChange {
    @Input()
    @HostBinding('class.card-withActions')
    public actions: NzDropdownMenuComponent;

    @Input()
    public actionsTpl: TemplateRef<void>;

    @Input()
    public backgroundColor: string;

    @Input()
    public borderColor: string;

    @ContentChild(CardFooterComponent)
    public footer: CardFooterComponent;

    @HostBinding('class.card-withActions')
    public get hasCellActions(): boolean {
        return this._cardLayout.config?.withActions;
    }

    @Input()
    @ListenPropertyChange()
    public indent = 0;

    @ListenPropertyChange()
    public isCollapseHandler = false;

    @HostBinding('class.card-tabular')
    public get isDisplayTabular(): boolean {
        return this._layout?.mode === CardModeEnum.tabular;
    }

    @Input()
    @ListenPropertyChange()
    public mode = CardModeEnum.responsive;

    @Input()
    @HostBinding('class.card-contentClickable')
    public redirectTo: RouteModel;

    /**
     * Taille de la carte, les valeurs possibles sont :
     * - CardSizeEnum : 'small', 'middle', 'large'
     * - une chaine indiquant une valeur par breakpoint, ex: 'lt-lg = large, gt-md = middle'
     *
     * La valeur par défaut dépend du mode :
     * - card : 'large'
     * - responsive : 'lt-lg = large, gt-md = middle'
     * - tabular : 'middle'
     */
    @Input()
    @ListenPropertyChange()
    public size: CardSizeEnum | string;

    @HostBinding('class.card-withCollapsePlaceholder')
    public withCollapsePlaceholder = false;

    private get _cardLayout(): CardLayoutService {
        return this._useCardLayoutInternal
            ? this._cardLayoutInternal
            : this._list.cardLayout;
    }

    @ContentChildren(CardCellComponent, { descendants: true })
    private _cells: QueryList<CardCellComponent>;

    private _destroy = new Subject<void>();

    @ContentChildren(CardFooterItemComponent, { descendants: true })
    private _footerItems: QueryList<CardFooterItemComponent>;

    @HostBinding('class.card-withDragDrop')
    private get _hostClassWithDragDrop(): boolean {
        return this._draggableTreeItem != null;
    }

    @HostBinding('class.card-withTopLabel')
    private get _hostClassWithTopLabel(): boolean {
        return this._cardLayout.config?.mode === CardModeEnum.responsive;
    }

    @HostBinding('style')
    private get _hostStyles(): CssStyleModel {
        // évite de voir le composant se construire et "clignoter"
        if (this._layout == null) {
            return { visibility: 'hidden' };
        }

        return {
            '--cardActionsSize': this._layout.actionsWidth,
            '--cardBackgroundColor': this.backgroundColor
                ? this.backgroundColor
                : 'var(--gray2)',
            '--cardCellActionsWidth': this._layout.cellActionsWidth,
            '--cardFooterItemWidth': `calc(100% / ${this._footerItems.length})`,
            '--cardGridTemplateColumns': this.isDisplayTabular
                ? this._gridTemplateColumns
                : null,
            '--cardIndent': this._indentPadding,
            '--cardIndicatorColor': this.borderColor,
            '--cardPadding': this._layout.padding,
            '--cardPaddingLeft': this._layout.firstCellPaddingLeft,
        };
    }

    private _gridTemplateColumns: string;

    private _indentPadding: string;

    private _layout: CardLayoutModel;

    private get _useCardLayoutInternal(): boolean {
        return this._list == null;
    }

    public constructor(
        private _cardLayoutInternal: CardLayoutService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Optional()
        private _draggableTreeItem: DraggableTreeItemDirective,
        @Optional()
        private _list: ListComponent
    ) {
        super();
    }

    public activateCollapseHandler(): void {
        this.isCollapseHandler = true;
        this._changeDetectorRef.markForCheck();
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.mode || changes.size || changes.isCollapseHandler) {
            this.updateLayoutConfig();
        }

        if (changes.indent) {
            this.updateIndentPadding();
        }
    }

    public ngAfterContentInit(): void {
        this.handleLayout();
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    private handleLayout(): void {
        this._cardLayout.layout
            .pipe(takeUntil(this._destroy))
            .subscribe((layout) => {
                this._layout = layout;
                this.withCollapsePlaceholder =
                    this._cardLayout.config?.withCollapse &&
                    !this.isCollapseHandler;

                this._changeDetectorRef.markForCheck();

                this.updateGrid();
            });

        this._cells.changes
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.updateGrid());

        this.initCellsFromListHeader();
    }

    private initCellsFromListHeader(): void {
        if (this._useCardLayoutInternal) {
            return;
        }

        this._cardLayout.initialCellsConfig
            /* le delay de 0 est pour éviter l'erreur ExpressionChangedAfterItHasBeenCheckedError
               qui est particulièrement difficile à éviter ici */
            .pipe(delay(0), takeUntil(this._destroy))
            .subscribe((config) => {
                this._cells
                    .filter((c, i) => config[i] != null)
                    .forEach((cell, index) => {
                        const cellConfig = config[index];

                        ['label', 'textAlign', 'width']
                            .filter((p) => cell[p] == null)
                            .forEach((p) => (cell[p] = cellConfig[p]));

                        this.updateGrid();
                    });
            });
    }

    private updateGrid(): void {
        this._gridTemplateColumns = this._cardLayout.getGridTemplateColumns(
            this._cells.map((c) => c.width)
        );

        this._changeDetectorRef.markForCheck();
    }

    private updateIndentPadding(): void {
        this._indentPadding = this._cardLayout.getIndentPadding(this.indent);

        this._changeDetectorRef.markForCheck();
    }

    private updateLayoutConfig(): void {
        // Le withCollapse peut-être définie aussi bien sur une liste que sur une carte (interne ou externe à la liste),
        // si au moins une carte interne de la liste est un collapse handler, alors la liste complète passe avec le collapse
        if (
            this._list &&
            !this._list.cardLayout.config?.withCollapse &&
            this.isCollapseHandler
        ) {
            this._list.cardLayout.config = {
                ...this._list.cardLayout.config,
                withCollapse: true,
            };
        }

        // les propriétés mode, size et withCollapse sont déjà renseignées par le ListComponent
        const base: Partial<CardLayoutConfigModel> = this._useCardLayoutInternal
            ? {
                  mode: this.mode,
                  size: this.size || this._cardLayout.getDefaultSize(this.mode),
                  withCollapse: this.isCollapseHandler,
              }
            : {};

        this._cardLayout.config = {
            ...this._cardLayout.config,
            ...base,
            // on ne renseigne la valeur de withActions que si elle vaut true,
            // car il suffit d'une seule carte dans une liste pour activer cette fonctionnalité
            withActions:
                this.actions != null ||
                this.actionsTpl != null ||
                this._cardLayout.config?.withActions,
            withDrag: this._draggableTreeItem != null,
        };

        this._changeDetectorRef.markForCheck();
    }
}

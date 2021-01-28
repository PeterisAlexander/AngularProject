import {
    Component,
    Input,
    OnDestroy,
    HostBinding,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Optional,
    OnInit,
    TemplateRef,
} from '@angular/core';
import { ListLoader } from 'src/app/lib/list-loader/loader/list-loader';
import { Subject } from 'rxjs';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { CardSizeEnum } from '../../card/card/card-size.enum';
import { ListLoaderInfinite } from 'src/app/lib/list-loader/loader/list-loader-infinite';
import { CardModeEnum } from '../../card/card/card-mode.enum';
import { CssStyleModel } from 'src/app/lib/model/css-style.model';
import {
    CardLayoutService,
    CARD_INDENT_BASE,
} from '../../card/card/card-layout.service';
import { CollapseHandlerBaseDirective } from '../../collapse/collapsable/collapse-handler-base.directive';
import { DropTreeDirective } from '../../drag-and-drop/drop-tree/drop-tree.directive';
import {
    trackByInstance,
    trackByProp,
} from 'src/app/core/utility/array/array.utility';
import { FormArray } from '@angular/forms';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [CardLayoutService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnDestroy, HandlePropertyChange, OnInit {
    @Input()
    @ListenPropertyChange()
    public collapseHandler: CollapseHandlerBaseDirective;

    @Input()
    @ListenPropertyChange()
    public data: any[] | FormArray | ListLoader<any> = [];

    @Input()
    public emptyTpl: TemplateRef<void>;

    @Input()
    public gridPattern = 'xs = 1, sm = 2, md = 4, lg = 5, gt-lg = 6';

    public get isGrid(): boolean {
        return this.cardLayout.config?.mode === CardModeEnum.card;
    }

    public isInfinitList = false;

    @Input()
    @ListenPropertyChange()
    public mode = CardModeEnum.responsive;

    /**
     * Taille des éléments de la liste, les valeurs possibles sont :
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

    /**
     * Méthode passée au *ngFor pour le trackBy (nécessaire pour l'optimisation)
     * utilisant une propriété id de l'item (cas le plus commun)
     */
    public trackById = trackByProp('id');

    /**
     * Méthode passée au *ngFor pour le trackBy (nécessaire pour l'optimisation)
     * utilisant l'instance de l'item
     */
    public trackByInstance = trackByInstance;

    /**
     * Méthode passée au *ngFor pour le trackBy (nécessaire pour l'optimisation)
     * utilisant une propriété de l'item
     */
    public trackByProp = trackByProp;

    private _destroy = new Subject<void>();

    @HostBinding('class.list-collapsed')
    private get _hostClassCollapsed(): boolean {
        return this.collapseHandler == null
            ? false
            : this.collapseHandler.collapsed;
    }

    @HostBinding('style')
    private get _hostStyles(): CssStyleModel {
        return {
            '--listCollapsableMargin': this.isGrid ? 'var(--space6)' : '1px',
        };
    }

    public constructor(
        public cardLayout: CardLayoutService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Optional()
        private _dropTree: DropTreeDirective
    ) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.data) {
            this.updateIsInfinitList();
        }

        if (changes.mode || changes.size || changes.collapseHandler) {
            this.updateCardLayout();
        }
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this.configureDropTree();
    }

    private configureDropTree(): void {
        if (this._dropTree == null) {
            return;
        }

        this._dropTree.indentSize = CARD_INDENT_BASE;
    }

    private updateCardLayout(): void {
        this.cardLayout.config = {
            ...this.cardLayout.config,
            mode: this.mode,
            size: this.size || this.cardLayout.getDefaultSize(this.mode),
            withCollapse: this.collapseHandler != null,
        };

        this._changeDetectorRef.markForCheck();
    }

    private updateIsInfinitList(): void {
        this.isInfinitList = this.data instanceof ListLoaderInfinite;

        this._changeDetectorRef.markForCheck();
    }
}

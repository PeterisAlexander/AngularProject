import { CardSizeEnum } from './card-size.enum';
import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { Subscription, ReplaySubject, Subject } from 'rxjs';
import { CardModeEnum } from './card-mode.enum';
import { BreakpointService } from 'src/app/lib/breakpoint/breakpoint.service';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { BreakpointEnum } from 'src/app/lib/breakpoint/breakpoint.enum';
import { takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { TextALignEnum } from 'src/app/lib/enum/text-align.enum';

const ACTIONS_WIDTH = 24;
export const CARD_INDENT_BASE = 24;

export interface CardLayoutConfigModel {
    mode: CardModeEnum;
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
    size: CardSizeEnum | string;
    withActions?: boolean;
    withCollapse: boolean;
    withDrag?: boolean;
}

export interface CardLayoutModel {
    actionsWidth: string;
    cellActionsWidth: string;
    firstCellPaddingLeft: string;
    mode: CardModeEnum.card | CardModeEnum.tabular;
    padding: string;
    size: CardSizeEnum;
}

export interface CardLayoutCellConfig {
    label: string | TemplateRef<void>;
    textAlign: TextALignEnum;
    width: string;
}

/**
 * Service de paramétrage du layout des cartes.
 * Utilisé dans le CardComponent, il l'est aussi dans le ListComponent (où remplace une partie du paramétrage des cartes)
 * et dans le ListHeaderComponent (dont beaucoup de styles sont en commun)
 */
@Injectable()
export class CardLayoutService implements OnDestroy, HandlePropertyChange {
    @ListenPropertyChange()
    public config: CardLayoutConfigModel;

    public initialCellsConfig = new ReplaySubject<CardLayoutCellConfig[]>(1);

    public layout = new ReplaySubject<CardLayoutModel>(1);

    private _currentLayout: CardLayoutModel;

    private _destroy = new Subject<void>();

    @ListenPropertyChange()
    private _isMobile = false;

    private _sizeSubscription: Subscription;

    public constructor(private _breakpoint: BreakpointService) {
        this._breakpoint
            .observe(BreakpointEnum.ltLg)
            .pipe(takeUntil(this._destroy))
            .subscribe((r) => (this._isMobile = r.matches));
    }

    public getDefaultSize(mode: CardModeEnum): CardSizeEnum | string {
        return mode === CardModeEnum.card
            ? CardSizeEnum.large
            : mode === CardModeEnum.tabular
            ? CardSizeEnum.middle
            : 'lt-lg = large, gt-md = middle';
    }

    public getGridTemplateColumns(cellsWidth: string[]): string {
        return (
            cellsWidth
                .map((w) => (w == null ? '1fr' : w))
                .map((w) => `minmax(0, ${w})`)
                .join(' ') +
            (this.config?.withActions
                ? ` ${this._currentLayout?.cellActionsWidth}`
                : '')
        );
    }

    public getIndentPadding(indent: number): string {
        return `${CARD_INDENT_BASE * indent}px`;
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        const isConfigUpdated =
            changes.config &&
            !isEqual(changes.config.previousValue, changes.config.currentValue);
        const isModeUpdated =
            isConfigUpdated &&
            changes.config.currentValue.mode !==
                changes.config.previousValue?.mode;
        const isSizeUpdated =
            isConfigUpdated &&
            changes.config.currentValue.size !==
                changes.config.previousValue?.size;

        if (isModeUpdated || (changes._isMobile && this.config != null)) {
            this.updateMode();
        }

        if (isSizeUpdated) {
            this.updateSize();
        }

        if (isConfigUpdated && !isModeUpdated && !isSizeUpdated) {
            this.updateLayout();
        }
    }

    public ngOnDestroy(): void {
        if (this._sizeSubscription) {
            this._sizeSubscription.unsubscribe();
        }

        this._destroy.next();
        this._destroy.complete();
    }

    private updateLayout(
        mode?: CardModeEnum.card | CardModeEnum.tabular,
        size?: CardSizeEnum
    ): void {
        const currentMode = mode || this._currentLayout?.mode;
        const currentSize = size || this._currentLayout?.size;

        const padding =
            currentSize === CardSizeEnum.middle
                ? 12
                : currentSize === CardSizeEnum.small
                ? 8
                : 24;

        const firstCellPaddingLeft = this.config.withCollapse
            ? 36 // = 12 (margin) + 12 (icône) + 12 (margin)
            : this.config.withDrag
            ? 24 // = largeur CardDragHandleComponent
            : padding;

        const cellActionsWidth = padding * 1.5 + ACTIONS_WIDTH;

        this._currentLayout = {
            actionsWidth: `${ACTIONS_WIDTH}px`,
            cellActionsWidth: `${cellActionsWidth}px`,
            firstCellPaddingLeft: `${firstCellPaddingLeft}px`,
            mode: currentMode,
            padding: `${padding}px`,
            size: currentSize,
        };

        this.layout.next(this._currentLayout);
    }

    private updateMode(): void {
        this.updateLayout(
            this.config.mode === CardModeEnum.responsive
                ? this._isMobile
                    ? CardModeEnum.card
                    : CardModeEnum.tabular
                : this.config.mode
        );
    }

    private updateSize(): void {
        if (this._sizeSubscription) {
            this._sizeSubscription.unsubscribe();
            this._sizeSubscription = null;
        }

        if (CardSizeEnum[this.config.size]) {
            this.updateLayout(null, this.config.size as CardSizeEnum);
            return;
        }

        this._sizeSubscription = this._breakpoint
            .valueFromBreakpoints(this.config.size)
            .subscribe((b) => this.updateLayout(null, b.value as CardSizeEnum));
    }
}

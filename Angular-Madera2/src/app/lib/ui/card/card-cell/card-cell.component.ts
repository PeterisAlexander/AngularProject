import {
    Component,
    Input,
    HostBinding,
    TemplateRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { CardCellTypeEnum } from './card-cell-type.enum';
import { TextALignEnum } from 'src/app/lib/enum/text-align.enum';
import { isString } from 'lodash';
import { CssStyleModel } from 'src/app/lib/model/css-style.model';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';

enum VerticalAlignEnum {
    top = 'top',
    center = 'center',
    bottom = 'bottom',
}

@Component({
    selector: 'app-card-cell',
    templateUrl: './card-cell.component.html',
    styleUrls: ['./card-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCellComponent implements HandlePropertyChange {
    @Input()
    public backgroundColor: string;

    public isString = isString;

    @Input()
    @ListenPropertyChange()
    public label: string | TemplateRef<void>;

    @Input()
    @ListenPropertyChange()
    public textAlign: TextALignEnum;

    @Input()
    public type = CardCellTypeEnum.default;

    @Input()
    public verticalAlign = VerticalAlignEnum.center;

    @Input()
    @ListenPropertyChange()
    public width: string;

    @Input()
    public withEllipsis = true;

    @HostBinding('class.cardCell-subTitle')
    private get _hostClassSubTitle(): boolean {
        return this.type === CardCellTypeEnum.subTitle;
    }

    @HostBinding('class.cardCell-title')
    private get _hostClassTitle(): boolean {
        return this.type === CardCellTypeEnum.title;
    }

    @HostBinding('style')
    private get _hostStyles(): CssStyleModel {
        return {
            '--cardCellBackgroundColor': this.backgroundColor
                ? this.backgroundColor
                : 'var(--cardBackgroundColor)',
            '--cardCellVerticalAlign':
                this.verticalAlign === VerticalAlignEnum.top
                    ? 'flex-start'
                    : this.verticalAlign === VerticalAlignEnum.bottom
                    ? 'flex-end'
                    : 'center',
        };
    }

    public constructor(private _changeDetectorRef: ChangeDetectorRef) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.label || changes.textAlign || changes.width) {
            this.manualChangeCheck();
        }
    }

    /**
     * Les propriétés label, textALign et width peuvent être modifiées via typescript
     * à partir du CardComponent, pour que la cellule se mette à jour, il faut déclencher
     * manuellement la détection de changement...
     */
    private manualChangeCheck(): void {
        this._changeDetectorRef.markForCheck();
    }
}

import {
    Component,
    Input,
    HostBinding,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { CollapseHandlerBaseDirective } from './collapse-handler-base.directive';
import { expendAnimation } from 'src/app/lib/animation';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-collapsable',
    templateUrl: './collapsable.component.html',
    styleUrls: ['./collapsable.component.css'],
    animations: [expendAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsableComponent implements HandlePropertyChange, OnDestroy {
    public collapsed = false;

    @Input()
    @ListenPropertyChange()
    public handler: CollapseHandlerBaseDirective;

    public isAnimating = false;

    private _handlerSubscription: Subscription;

    @HostBinding('class.overflowHidden')
    private get _hostClassOverflow(): boolean {
        return this.isAnimating || this.handler?.collapsed;
    }

    public constructor(private _changeDetectorRef: ChangeDetectorRef) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.handler) {
            this.activateHandler();
        }
    }

    public ngOnDestroy(): void {
        this._handlerSubscription?.unsubscribe();
    }

    private activateHandler(): void {
        this._handlerSubscription?.unsubscribe();

        if (this.handler == null) {
            this.collapsed = false;
            this._changeDetectorRef.markForCheck();
            return;
        }

        this.handler.activateCollapseHandler();
        this._handlerSubscription = this.handler.collapsedChange.subscribe(
            (collapsed) => {
                this.collapsed = collapsed;
                this._changeDetectorRef.markForCheck();
            }
        );

        this.collapsed = this.handler.collapsed;
        this._changeDetectorRef.markForCheck();
    }
}

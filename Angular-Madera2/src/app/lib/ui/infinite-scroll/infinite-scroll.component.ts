import {
    ElementRef,
    Input,
    OnDestroy,
    Component,
    ViewChild,
    AfterViewInit,
    TemplateRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ListLoaderInfinite } from '../../list-loader/loader/list-loader-infinite';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';

@Component({
    selector: 'app-infinite-scroll',
    templateUrl: './infinite-scroll.component.html',
    styleUrls: ['./infinite-scroll.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollComponent<ItemData>
    implements AfterViewInit, OnDestroy, HandlePropertyChange {
    @Input()
    public emptyWithFilterTemplate: TemplateRef<ItemData>;

    @Input()
    public emptyWithoutFilterTemplate: TemplateRef<ItemData>;

    @Input()
    public list: ListLoaderInfinite<ItemData>;

    @Input()
    @ListenPropertyChange()
    public scrollable: HTMLElement;

    /**
     * Ancre servant de référence pour détecter le besoin de charger des données
     */
    @ViewChild('anchor')
    private _anchor: ElementRef;

    private _observer: IntersectionObserver;

    public constructor(private _elementRef: ElementRef) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.scrollable) {
            this.watchScroll();
        }
    }

    public ngAfterViewInit(): void {
        this.watchScroll();
    }

    public ngOnDestroy(): void {
        if (this._observer != null) {
            this._observer.disconnect();
        }
    }

    private getScrollableElement(): HTMLElement {
        if (this.scrollable != null) {
            return this.scrollable;
        }

        const style = window.getComputedStyle(this._elementRef.nativeElement);

        if (
            style.getPropertyValue('overflow') === 'auto' ||
            style.getPropertyValue('overflow-y') === 'scroll'
        ) {
            return this._elementRef.nativeElement;
        }

        return null;
    }

    private stopWatchingScroll(): void {
        if (this._observer == null) {
            return;
        }

        this._observer.disconnect();
        this._observer = null;
    }

    private watchScroll(): void {
        this.stopWatchingScroll();

        this._observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    this.list.getData();
                }
            },
            {
                root: this.getScrollableElement(),
                rootMargin: '50px 0px',
            }
        );

        this._observer.observe(this._anchor.nativeElement);
    }
}

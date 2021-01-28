import {
    Component,
    Input,
    TemplateRef,
    ElementRef,
    Renderer2,
    AfterViewInit,
    OnDestroy,
    HostBinding,
    ViewChild,
} from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { Subject, fromEvent } from 'rxjs';
import { map, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ListAddService } from '../list/list-add/list-add.service';

enum CssClassesEnum {
    fixed = 'pageHeader-fixed',
}

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.css'],
})
export class PageHeaderComponent implements AfterViewInit, OnDestroy {
    @Input()
    public extra: TemplateRef<void>;

    @Input()
    public extraTitle: string | TemplateRef<void>;

    public get pageHeaderAddButtonSize(): string {
        if (this.layout.isMobile) {
            return 'large';
        }

        return this.layout.isFixedPageHeader ? 'small' : 'default';
    }

    @Input()
    public subtitle: string | TemplateRef<void>;

    @Input()
    public title: string | TemplateRef<void>;

    @Input()
    @HostBinding('class.pageHeader-withBorder')
    public withBorder = true;

    private _destroy = new Subject<void>();

    private get _element(): HTMLElement {
        return this._elementRef.nativeElement;
    }

    private get _elementHeight(): number {
        return this._isPlaceholderInDOM
            ? this._placeholder.getBoundingClientRect().height
            : this._element.getBoundingClientRect().height;
    }

    private get _isPlaceholderInDOM(): boolean {
        return this._element.parentElement.contains(this._placeholder);
    }

    @ViewChild('pageLabelTpl')
    private _pageLabel: TemplateRef<void>;

    private _placeholder = document.createElement('div');

    public constructor(
        public layout: LayoutService,
        public listAdd: ListAddService,
        private _elementRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2
    ) {}

    public ngAfterViewInit(): void {
        this.layout.pageHeader = this._pageLabel;

        fromEvent(window, 'scroll')
            .pipe(
                map(() => this.isSticky(window.scrollY)),
                distinctUntilChanged(),
                takeUntil(this._destroy)
            )
            .subscribe((i) => this.updateState(i));

        this.layout.layoutChanged
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.updateState(this.isSticky(window.scrollY)));
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    private isSticky(scroll: number): boolean {
        return (
            scroll >
            (this.layout.isFixedHeader ? 0 : this.layout.headerHeight) +
                this._elementHeight
        );
    }

    private resetState(): void {
        this.layout.showPageHeaderInHeader = false;
        this.layout.isFixedPageHeader = false;

        if (this._isPlaceholderInDOM) {
            this._renderer.removeChild(
                this._element.parentElement,
                this._placeholder
            );
        }

        this._renderer.removeClass(this._element, CssClassesEnum.fixed);
        this._renderer.setStyle(this._element, 'left', '');
    }

    private updateState(isSticky: boolean): void {
        this.resetState();

        if (!isSticky) {
            return;
        }

        if (this.layout.isFixedHeader) {
            this.layout.showPageHeaderInHeader = true;
            return;
        }

        this.layout.isFixedPageHeader = true;

        this._renderer.setStyle(
            this._placeholder,
            'height',
            `${this._elementHeight}px`
        );

        this._renderer.insertBefore(
            this._element.parentElement,
            this._placeholder,
            this._element
        );

        if (!this.layout.isDrawerNav) {
            this._renderer.setStyle(
                this._element,
                'left',
                `${this.layout.navWidth}px`
            );
        }

        this._renderer.addClass(this._element, CssClassesEnum.fixed);
    }
}

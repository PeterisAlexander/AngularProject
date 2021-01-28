import {
    Component,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    HostBinding,
    ContentChildren,
    QueryList,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { SubNavItemComponent } from '../sub-nav-item/sub-nav-item.component';
import { chain, isString } from 'lodash';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-sub-nav',
    templateUrl: './sub-nav.component.html',
    styleUrls: ['./sub-nav.component.css'],
})
export class SubNavComponent implements AfterViewInit, OnDestroy {
    @ContentChildren(SubNavItemComponent)
    public items: QueryList<SubNavItemComponent>;

    @HostBinding('class.subNav-controlsShown')
    public subNavControlsShown = false;

    private get _activeItem(): SubNavItemComponent {
        let activeItem = this.items?.find((item) => {
            return (
                this.stringifyPath(item.redirectTo.path) ===
                window.location.pathname
            );
        });

        if (!activeItem) {
            activeItem = this.items?.find((item) =>
                new RegExp(this.stringifyPath(item.redirectTo.path)).test(
                    window.location.pathname
                )
            );
        }

        return activeItem;
    }

    private _destroy = new Subject<void>();

    @ViewChild('subNav')
    private _subNav: ElementRef<HTMLElement>;

    public constructor(public router: Router) {
        this.listenRouter();
    }

    public listenItems(): void {
        this.items.changes
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.handleControlsDisplay());
    }

    public ngAfterViewInit(): void {
        this.handleControlsDisplay();
        this.manageActivation();
        this.listenItems();
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public scrollToNext(): void {
        this._subNav.nativeElement.scrollTo({
            top: 0,
            left:
                this._subNav.nativeElement.scrollLeft +
                this._subNav.nativeElement.getBoundingClientRect().width,
            behavior: 'smooth',
        });
    }

    public scrollToPrev(): void {
        this._subNav.nativeElement.scrollTo({
            top: 0,
            left:
                this._subNav.nativeElement.scrollLeft -
                this._subNav.nativeElement.getBoundingClientRect().width,
            behavior: 'smooth',
        });
    }

    private handleControlsDisplay(): void {
        this.subNavControlsShown =
            this._subNav.nativeElement.scrollWidth >
            this._subNav.nativeElement.clientWidth;

        fromEvent(window, 'resize')
            .pipe(takeUntil(this._destroy))
            .subscribe(() => {
                this.subNavControlsShown =
                    this._subNav.nativeElement.scrollWidth >
                    this._subNav.nativeElement.clientWidth;
            });
    }

    private listenRouter(): void {
        this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                takeUntil(this._destroy)
            )
            .subscribe(() => {
                this.manageActivation();
            });
    }

    private manageActivation(): void {
        if (!this._activeItem) {
            return;
        }

        // asychronisme pour éviter l'erreur ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
            this.items.forEach((item) => (item.isActive = false));
            this._activeItem.isActive = true;
        }, 0);

        this._activeItem.elementRef.nativeElement.scrollIntoView();
    }

    private stringifyPath(path: string | any[]): string {
        return chain<string>(isString(path) ? [path] : path)
            .flatten()
            .map((cc) => encodeURI(cc.toString()))
            .join('/')
            .value();
    }
}

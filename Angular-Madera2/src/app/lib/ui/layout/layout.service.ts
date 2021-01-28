import {
    Injectable,
    OnDestroy,
    TemplateRef,
    EventEmitter,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, ReplaySubject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';
import { BreakpointEnum } from '../../breakpoint/breakpoint.enum';
import { UserStorageService } from '../../user-storage/user-storage.service';

export enum NavModeEnum {
    compact,
    drawer,
    large,
}

const USER_STORAGE_NAV_MODE = 'nav.mode';

@Injectable({
    providedIn: 'root',
})
export class LayoutService implements OnDestroy, HandlePropertyChange {
    public readonly headerHeight = 48;

    public get isCompactNav(): boolean {
        return this.navMode === NavModeEnum.compact;
    }

    public get isDesktop(): boolean {
        return this._isDesktop;
    }

    public get isDrawerNav(): boolean {
        return this.navMode === NavModeEnum.drawer;
    }

    public get isFixedHeader(): boolean {
        return this.isMobile;
    }

    public isFixedPageHeader = false;

    public get isLargeNav(): boolean {
        return this.navMode === NavModeEnum.large;
    }

    public get isMobile(): boolean {
        return !this.isDesktop;
    }

    public layoutChanged = new EventEmitter<void>();

    @ListenPropertyChange()
    public navMode: NavModeEnum;

    public get navWidth(): number {
        return this._navWidthes[this.navMode];
    }

    /**
     * Entête de page se retrouvant en position "sticky" en mobile
     */
    public pageHeader: string | TemplateRef<void>;

    /**
     * Titre de la page utilisé pour construire le nom de l'onglet du navigateur
     */
    public pageTitle = new ReplaySubject<string>(1);

    public showPageHeaderInHeader = false;

    private _destroy = new Subject<void>();

    @ListenPropertyChange()
    private _isDesktop = false;

    private _navWidthes = {
        [NavModeEnum.compact]: 56,
        [NavModeEnum.drawer]: 240,
        [NavModeEnum.large]: 240,
    };

    public constructor(
        private _breakpointObserver: BreakpointObserver,
        private _router: Router,
        private _userStorage: UserStorageService
    ) {
        this.setNavMode();
        this.addResponsive();
        this.resetOnNavigation();
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.navMode || changes._isDesktop) {
            this.layoutChanged.emit();
        }

        if (changes.navMode) {
            this.onNavModeChange();
        }

        if (changes._isDesktop) {
            this.setNavMode();
        }
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    private addResponsive(): void {
        this._breakpointObserver
            .observe(BreakpointEnum.gtMd)
            .pipe(takeUntil(this._destroy))
            .subscribe((r) => (this._isDesktop = r.matches));
    }

    private onNavModeChange(): void {
        if (this.navMode === NavModeEnum.drawer) {
            return;
        }

        this._userStorage.set(USER_STORAGE_NAV_MODE, this.navMode);
    }

    private resetOnNavigation(): void {
        this._router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                takeUntil(this._destroy)
            )
            .subscribe(() => {
                this.pageHeader = null;
                this.pageTitle.next(null);
                this.isFixedPageHeader = false;
                this.showPageHeaderInHeader = false;
            });
    }

    private setNavMode(): void {
        if (this.isMobile) {
            this.navMode = NavModeEnum.drawer;
            return;
        }

        this.navMode =
            this._userStorage.get(USER_STORAGE_NAV_MODE) ||
            (window.innerWidth > 1920
                ? NavModeEnum.large
                : NavModeEnum.compact);
    }
}

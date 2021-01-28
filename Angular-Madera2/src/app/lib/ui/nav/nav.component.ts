import {
    Component,
    HostBinding,
    Input,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output,
} from '@angular/core';
import { LayoutService, NavModeEnum } from '../layout/layout.service';
import { NavCategoryItemModel } from './nav-category-item.model';
import { NavItemModel } from './nav-item.model';
import { Router, NavigationStart } from '@angular/router';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';

const PLATFORM_WINDOWS = 'Win32';

@Component({
    selector: 'app-nav',
    styleUrls: ['./nav.component.css'],
    templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit, OnDestroy, HandlePropertyChange {
    @Input()
    @ListenPropertyChange()
    public activeNavItems: (NavCategoryItemModel | NavItemModel)[] = [];

    @Input()
    public categories: NavCategoryItemModel[] = [];

    public get hasSmartScrollbars(): boolean {
        // les scrollbars sont remplacées uniquement sous windows
        // car elles jurent avec la nav (scrollbars claires vs nav sombre)
        return window.navigator.platform === PLATFORM_WINDOWS;
    }

    public openedItems: (NavCategoryItemModel | NavItemModel)[] = [];

    public secondLevelPanelOpened = false;

    /**
     * Indique si la navigation est affichée, valable uniquement
     * lorsqu'elle est dans un drawer => affichage mobile
     */
    @Input()
    @ListenPropertyChange()
    public shown = false;

    @Output()
    public shownChange = new EventEmitter<boolean>();

    @Input()
    public title: string;

    private _destroy = new Subject<void>();

    @HostBinding('class.nav-compact')
    private get _hostCompact(): boolean {
        return this.layout.isCompactNav;
    }

    @HostBinding('class.nav-large')
    private get _hostLarge(): boolean {
        return this.layout.isLargeNav;
    }

    private _hideSecondLevelPanelTimer: any;

    public constructor(public layout: LayoutService, private _router: Router) {}

    public getFirstLevelItemStyles(
        item: NavCategoryItemModel
    ): { [prop: string]: string } {
        if (item.color) {
            return { '--navItemActiveColor': item.color };
        }

        return {};
    }

    public handleFirstLevelItemHover(item?: NavCategoryItemModel): void {
        if (!this.layout.isCompactNav) {
            return;
        }

        clearTimeout(this._hideSecondLevelPanelTimer);

        if (item == null) {
            this.secondLevelPanelOpened = true;
            return;
        }

        this.openedItems = [item];
        this.secondLevelPanelOpened = this.openedItems[0].children?.length > 0;
    }

    public handleFirstLevelItemLeave(): void {
        if (!this.layout.isCompactNav) {
            return;
        }

        // le timeout de 250 c'est pour laisser à l'utilisateur le temps d'aller :
        // - d'un item de nav vers un item de nav
        // - de la nav vers le panel et inversement
        this._hideSecondLevelPanelTimer = setTimeout(() => {
            this.openedItems = [];
            this.secondLevelPanelOpened = false;
        }, 250);
    }

    public handleItemClick(item: NavItemModel, level: number): void {
        if (item.route || (this.layout.isCompactNav && level === 1)) {
            return;
        }

        if (level === 1) {
            this.openedItems = this.openedItems[0] === item ? [] : [item];
        }

        if (level === 2) {
            this.openedItems =
                this.openedItems[1] === item
                    ? [this.openedItems[0]]
                    : [this.openedItems[0], item];
        }
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.activeNavItems) {
            this.setItemsOpened();
        }
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this.hideWhenNavigate();
    }

    public toggleDisplay(): void {
        if (this.layout.isMobile) {
            this.shown = false;
            return;
        }

        this.layout.navMode =
            this.layout.navMode === NavModeEnum.compact
                ? NavModeEnum.large
                : NavModeEnum.compact;

        if (this.layout.isCompactNav) {
            this.secondLevelPanelOpened = false;
        }

        this.setItemsOpened();
    }

    private hideWhenNavigate(): void {
        this._router.events
            .pipe(
                // sur le NavigationStart pour que la nav se ferme tout de suite
                // car le NavigationEnd peut donner une impression de lenteur
                filter((e) => e instanceof NavigationStart),
                takeUntil(this._destroy)
            )
            .subscribe(() => {
                this.secondLevelPanelOpened = false;
                this.shown = false;
            });
    }

    private setItemsOpened(): void {
        this.openedItems = this.activeNavItems
            .slice(0, 2)
            .filter((i) => i.route == null);
    }
}

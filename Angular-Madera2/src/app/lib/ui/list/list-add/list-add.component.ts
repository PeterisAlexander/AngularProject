import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    HostBinding,
    ViewChild,
} from '@angular/core';
import { LayoutService } from '../../layout/layout.service';
import { ListAddService } from './list-add.service';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

interface ExtraButtonMenu {
    action: () => void;
    label: string;
}

@Component({
    selector: 'app-list-add',
    templateUrl: './list-add.component.html',
    styleUrls: ['./list-add.component.css'],
})
export class ListAddComponent
    implements OnInit, OnDestroy, HandlePropertyChange {
    @Output()
    public add = new EventEmitter<void>();

    public drawerHeight = '0px';

    @Input()
    @ListenPropertyChange()
    public extraButtonList: ExtraButtonMenu[] = [];

    @Input()
    @ListenPropertyChange()
    public label = 'Nouveau';

    @ViewChild('menu', { static: true })
    public menu: NzDropdownMenuComponent;

    private _destroy = new Subject<void>();

    @HostBinding('class.listAdd-mobile')
    private get _hostClassMobile(): boolean {
        return this.layout.isMobile;
    }

    @HostBinding('class.hidden')
    private get _hostClassHidden(): boolean {
        return this.layout.isDesktop && this.layout.isFixedPageHeader;
    }

    public constructor(
        public layout: LayoutService,
        private _listAddService: ListAddService
    ) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.label) {
            this._listAddService.label = this.label;
        }

        if (changes.extraButtonList) {
            this._listAddService.extraButtonList = this.extraButtonList;
            this._listAddService.dropdownMenu = this.menu;

            this.initDrawerHeight();
        }
    }

    public ngOnDestroy(): void {
        this._listAddService.label = null;
        this._listAddService.extraButtonList = null;

        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this._listAddService.add
            .pipe(takeUntil(this._destroy))
            .subscribe(() => this.add.emit());
    }

    private initDrawerHeight(): void {
        if (this.extraButtonList) {
            const height = (2 + this.extraButtonList.length) * 40;

            this.drawerHeight = `${height}px`;
        }
    }
}

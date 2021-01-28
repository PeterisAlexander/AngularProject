import {
    Component,
    Input,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
} from '@angular/core';
import { ListLoader } from '../../list-loader/loader/list-loader';
import { fromEvent, Subject } from 'rxjs';
import {
    map,
    distinctUntilChanged,
    takeUntil,
    debounceTime,
    filter,
} from 'rxjs/operators';
import { HighlightSearchService } from '../highlight/highlight-search/highlight-search.service';
import { LayoutService } from '../layout/layout.service';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ListFilterModel } from './list-filter.model';
import { ListFilterDrawerModel } from './list-filter-drawer.model';

@Component({
    selector: 'app-list-filter',
    templateUrl: './list-filter.component.html',
    styleUrls: ['./list-filter.component.css'],
})
export class ListFilterComponent
    implements AfterViewInit, HandlePropertyChange {
    @Input()
    @ListenPropertyChange()
    public filters: ListFilterModel = { searchValue: '' };

    @Output()
    public filtersChange = new EventEmitter<ListFilterModel>();

    @Input()
    public filtersDrawer: ListFilterDrawerModel<any>;

    @Input()
    public list: ListLoader<any>;

    @Input()
    public placeHolder = 'Rechercher dans la liste';

    @Input()
    public showSearchInput = true;

    private _destroy = new Subject<void>();

    @ViewChild('search')
    private _search: ElementRef;

    public constructor(
        public layout: LayoutService,
        private _highlightSearch: HighlightSearchService
    ) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.filters) {
            this._highlightSearch.query =
                changes.filters.currentValue.searchValue;
            this.reloadList();
        }
    }

    public ngAfterViewInit(): void {
        fromEvent(this._search.nativeElement, 'keyup')
            .pipe(
                map((event: KeyboardEvent) => {
                    return (event.target as HTMLInputElement).value;
                }),
                distinctUntilChanged(),
                debounceTime(250),
                takeUntil(this._destroy)
            )
            .subscribe(
                (v) => (this.filters = { ...this.filters, searchValue: v })
            );

        if (this.filtersDrawer) {
            this.filtersDrawer.submit
                .pipe(
                    filter((customFilters) => customFilters != null),
                    takeUntil(this._destroy)
                )
                .subscribe((customFilters) => {
                    this.filters = {
                        ...customFilters,
                        searchValue: this.filters.searchValue,
                    };
                });
        }
    }

    private reloadList(): void {
        if (this.list == null) {
            return;
        }

        this.list.patchParams({ ...this.filters });
        this.list.reload();
    }
}

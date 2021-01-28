import {
    Directive,
    Input,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    Optional,
} from '@angular/core';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { ListLoaderFinite } from '../../../list-loader/loader/list-loader-finite';
import { ListLoaderInfinite } from '../../../list-loader/loader/list-loader-infinite';
import { Entity } from 'src/app/core/entity/entity';
import { Observable, of, Subject } from 'rxjs';
import { filter, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ControlContainer } from '@angular/forms';

/**
 * Directive permettant de configurer automatiquement un composant NzSelectComponent
 * en fonction d'un ListLoader (finite ou infinite).
 *
 * La configuration concerne :
 * - l'état de chargement :
 *   - nzLoading
 * - le scroll infini :
 *   - nzScrollToBottom
 * - la recherche :
 *   - nzServerSearch
 *   - nzOnSearch
 * - la sélection
 *   - compareWith
 */
@Directive({
    selector: '[appSelectLoader]',
    exportAs: 'appSelectLoader',
})
export class SelectLoaderDirective<TData extends Entity>
    implements OnInit, OnDestroy {
    @Input('autoselect')
    public autoselect: boolean | Observable<void> = false;

    @Input('appSelectLoaderCompareWith')
    public compareWith: (o1: TData, o2: TData) => boolean;

    @Input('appSelectLoader')
    public loader: ListLoaderFinite<TData> | ListLoaderInfinite<TData>;

    private _destroy = new Subject<void>();

    public constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Optional()
        private _controlContainer: ControlContainer,
        private _select: NzSelectComponent
    ) {}

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this._select.compareWith = this.compareWith
            ? this.compareWith
            : this.loader.compareWith;
        this._changeDetectorRef.markForCheck();

        this.loader.isLoading
            .pipe(takeUntil(this._destroy))
            .subscribe((isLoading) => {
                this._select.nzLoading = isLoading;
                this._changeDetectorRef.markForCheck();
            });

        if (this._select.nzShowSearch) {
            this._select.nzServerSearch = true;
            this._select.nzOnSearch
                .pipe(takeUntil(this._destroy))
                .subscribe((q) => this.loader.search(q));
        }

        if (this.loader instanceof ListLoaderInfinite) {
            this._select.nzScrollToBottom
                .pipe(takeUntil(this._destroy))
                .subscribe(() => this.loader.getData());
        }

        // le nz-select récupère automatiquement les données
        // sauf lorsque la recherche n'est pas active
        if (!this._select.nzShowSearch) {
            this.loader.getData();
        }

        if (this.autoselect === true) {
            this.autoselectRequest().pipe(takeUntil(this._destroy)).subscribe();
        } else if (this.autoselect instanceof Observable) {
            this.autoselect
                .pipe(
                    takeUntil(this._destroy),
                    switchMap(() => this.autoselectRequest())
                )
                .subscribe();
        }
    }

    private autoselectRequest(): Observable<void> {
        if (
            this._controlContainer == null ||
            this._controlContainer.control.touched ||
            this._controlContainer.control.value != null
        ) {
            return of(null);
        }

        return this.loader.getSingleItem().pipe(
            filter((i) => i != null),
            tap((i) => this._controlContainer.control.setValue(i)),
            mapTo(null)
        );
    }
}

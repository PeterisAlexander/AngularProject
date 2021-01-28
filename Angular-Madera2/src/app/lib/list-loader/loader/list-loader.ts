import { EventEmitter } from '@angular/core';
import { isArray, isPlainObject, last } from 'lodash';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import {
    distinctUntilChanged,
    finalize,
    map,
    shareReplay,
    switchMap,
} from 'rxjs/operators';
import { QueryParamModel } from '../../http/query-param.model';
import { toHttpParams } from '../../utility/http';
import { compareWithProp } from '../../utility/object';
import { DataFetcher } from './data-fetcher';

interface DataSourceModel<Item> {
    fn: DataFetcher<Item>;
    hasMoreData: boolean;
    length: number;
}

export abstract class ListLoader<DataFetcherItem, Item = DataFetcherItem> {
    public cleaned = new EventEmitter<void>();

    public data: Observable<Item[]>;

    public hasParam: boolean;

    public isEmpty: Observable<boolean>;

    public isLoading: Observable<boolean>;

    public get params(): Readonly<QueryParamModel> {
        return this._clearedParams;
    }

    private _clearedParams: QueryParamModel;

    private _currentRequestSubscription: Subscription;

    private _dataSources: DataSourceModel<DataFetcherItem>[] = [];

    private _dataSubject = new BehaviorSubject<Item[]>([]);

    // Type any car impossible de typer du retour d'un setTimeout (NodeJS.Timeout ou number selon la signature)
    private _debounceTimerGetData: any;

    // Type any car impossible de typer du retour d'un setTimeout (NodeJS.Timeout ou number selon la signature)
    private _debounceTimerSearch: any;

    private _isLoadingSubject = new BehaviorSubject<boolean>(false);

    public constructor(
        dataFetcher:
            | DataFetcher<DataFetcherItem>
            | DataFetcher<DataFetcherItem>[],
        params: QueryParamModel = {}
    ) {
        this.setDataFetcher(dataFetcher);
        this.setParams(params);
        this.setObservablesFromSubject();
    }

    public clean(): void {
        this._dataSources.forEach((source) => {
            source.hasMoreData = true;
            source.length = 0;
        });

        this._dataSubject.next([]);
        this.cleaned.emit();
    }

    public compareWith(o1: Item, o2: Item): boolean {
        return isPlainObject(o1) &&
            isPlainObject(o2) &&
            'id' in o1 &&
            'id' in o2
            ? compareWithProp(o1, o2, 'id')
            : o1 === o2;
    }

    public getData(amount?: number): void {
        const noMoreData = this._dataSources.every((s) => !s.hasMoreData);

        if (noMoreData) {
            return;
        }

        clearTimeout(this._debounceTimerGetData);

        // entre les filres, l'infinitScroll, etc, à l'initialisation plusieurs getData()
        // peuvent être appelés consécutivement et plutôt que d'annuler les 1ères requêtes
        // (pour préserver l'API), on retarde l'exécution pour n'exécuter que la dernière,
        // pour cela 10ms semble bien fonctionner
        this._debounceTimerGetData = setTimeout(() => {
            this.unsubscribeCurrentRequest();

            this._isLoadingSubject.next(true);

            this._currentRequestSubscription = this.getDataInternal(amount)
                .pipe(
                    map((d) => this.prepareData(d)),
                    finalize(() => this.unsubscribeCurrentRequest())
                )
                .subscribe((r) =>
                    this._dataSubject.next(
                        amount == null ? r : [...this._dataSubject.value, ...r]
                    )
                );
        }, 10);
    }

    public getSingleItem(): Observable<Item> {
        let topTwo: DataFetcherItem[] = [];

        // il faut essayer de récupérer les 2 1ers items sur l'ensemble des sources de données
        // pour vérifier s'il n'y en a qu'un seul
        const getTopTwo = (index = 0): Observable<Item> => {
            const dataFetcher = this._dataSources[index];

            if (dataFetcher == null || topTwo.length === 2) {
                return of(null);
            }

            return dataFetcher.fn(toHttpParams(this.params)).pipe(
                switchMap((data) => {
                    topTwo = [...topTwo, ...data.slice(0, 2 - topTwo.length)];

                    return getTopTwo(index + 1);
                })
            );
        };

        return getTopTwo().pipe(
            map(() =>
                topTwo.length === 1 ? this.prepareData(topTwo)[0] : null
            )
        );
    }

    public patchParams(value: Partial<QueryParamModel>): void {
        this.setParams({ ...this.params, ...value });
    }

    /**
     * Permet de définir une méthode de transformation de données post récupération
     */
    public prepareData(data: DataFetcherItem[]): Item[] {
        return (data as unknown) as Item[];
    }

    public reload(): void {
        this.clean();
        this.getData();
    }

    public search(query: string): void {
        clearTimeout(this._debounceTimerSearch);

        this._debounceTimerSearch = setTimeout(() => {
            if (query === this.params?.searchValue) {
                return;
            }

            this.patchParams({ searchValue: query });
            this.reload();
        }, 250);
    }

    public setDataFetcher(
        dataFetcher:
            | DataFetcher<DataFetcherItem>
            | DataFetcher<DataFetcherItem>[]
    ): void {
        this.unsubscribeCurrentRequest();

        this._dataSources = (isArray(dataFetcher)
            ? dataFetcher
            : [dataFetcher]
        ).map((fn) => ({
            fn,
            hasMoreData: true,
            length: 0,
        }));
    }

    public setParams(value: QueryParamModel = {}): void {
        this._clearedParams = this.clearParams(value);
        this.hasParam = Object.keys(this._clearedParams).length > 0;
    }

    /**
     * Celui qui hérite la classe doit construire via cette méthode la requête de récupération des données,
     * cela permet entre autre de permettre la récupération partielle des données (gestion des infinis et paginations)
     */
    protected abstract getDataRequest(
        dataFetcher: DataFetcher<DataFetcherItem>,
        itemsLoaded: number,
        amount?: number
    ): Observable<DataFetcherItem[]>;

    private clearParams(params: QueryParamModel): QueryParamModel {
        const filteredValues = {};

        Object.keys(params)
            .filter((key) => params[key] != null && params[key] !== '')
            .forEach((key) => (filteredValues[key] = params[key]));

        return filteredValues;
    }

    private getDataInternal(amount?: number): Observable<DataFetcherItem[]> {
        const currentDataSource = this._dataSources.find((s) => s.hasMoreData);

        if (currentDataSource == null) {
            return of([]);
        }

        const isLastDataSource = currentDataSource === last(this._dataSources);

        return this.getDataRequest(
            currentDataSource.fn,
            currentDataSource.length,
            amount
        ).pipe(
            switchMap((data) => {
                currentDataSource.length += data.length;
                currentDataSource.hasMoreData =
                    amount != null && amount === data.length;

                const dontNeedMoreData =
                    (isLastDataSource &&
                        (amount == null || amount > data.length)) ||
                    amount === data.length;

                if (dontNeedMoreData) {
                    return of(data);
                }

                return this.getDataInternal(
                    amount == null ? null : amount - data.length
                ).pipe(map((moreData) => [...data, ...moreData]));
            })
        );
    }

    private setObservablesFromSubject(): void {
        this.data = this._dataSubject.asObservable().pipe(shareReplay(1));

        this.isEmpty = this.data.pipe(
            map((d) => d.length === 0),
            shareReplay(1)
        );

        this.isLoading = this._isLoadingSubject
            .asObservable()
            .pipe(distinctUntilChanged(), shareReplay(1));
    }

    private unsubscribeCurrentRequest(): void {
        this._currentRequestSubscription?.unsubscribe();
        this._currentRequestSubscription = null;
        this._isLoadingSubject.next(false);
    }
}

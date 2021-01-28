import { Injectable } from '@angular/core';
import { ListLoaderInfinite } from './loader/list-loader-infinite';
import { ListLoaderFinite } from './loader/list-loader-finite';
import { ListLoaderPagination } from './loader/list-loader-pagination';
import { listLoaderEmpty } from './utility/list-loader.utility';
import { DataFetcher } from './loader/data-fetcher';
import { QueryParamModel } from '../http/query-param.model';

@Injectable()
export class ListLoaderService {
    public finite<DataFetcherItem, Item = DataFetcherItem>(
        dataFetcher:
            | DataFetcher<DataFetcherItem>
            | DataFetcher<DataFetcherItem>[] = listLoaderEmpty,
        params?: QueryParamModel
    ): ListLoaderFinite<DataFetcherItem, Item> {
        return new ListLoaderFinite<DataFetcherItem, Item>(dataFetcher, params);
    }

    public infinite<DataFetcherItem, Item = DataFetcherItem>(
        dataFetcher:
            | DataFetcher<DataFetcherItem>
            | DataFetcher<DataFetcherItem>[] = listLoaderEmpty,
        params?: QueryParamModel
    ): ListLoaderInfinite<DataFetcherItem, Item> {
        return new ListLoaderInfinite<DataFetcherItem, Item>(
            dataFetcher,
            params
        );
    }

    public pagination<DataFetcherItem, Item = DataFetcherItem>(
        dataFetcher:
            | DataFetcher<DataFetcherItem>
            | DataFetcher<DataFetcherItem>[] = listLoaderEmpty,
        params?: QueryParamModel
    ): ListLoaderPagination<DataFetcherItem, Item> {
        return new ListLoaderPagination<DataFetcherItem, Item>(
            dataFetcher,
            params
        );
    }
}

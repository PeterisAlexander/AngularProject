import { Observable } from 'rxjs';
import { QueryParamModel } from '../../http/query-param.model';
import { toHttpParams } from '../../utility/http';
import { DataFetcher } from './data-fetcher';
import { ListLoader } from './list-loader';

export class ListLoaderInfinite<
    DataFetcherItem,
    Item = DataFetcherItem
> extends ListLoader<DataFetcherItem, Item> {
    public count = 50;

    public getData(): void {
        super.getData(this.count);
    }

    protected getDataRequest(
        dataFetcher: DataFetcher<DataFetcherItem>,
        itemsLoaded: number,
        amount: number
    ): Observable<DataFetcherItem[]> {
        const params: QueryParamModel = {
            ...this.params,
            top: amount,
            skip: itemsLoaded,
        };

        return dataFetcher(toHttpParams(params));
    }
}

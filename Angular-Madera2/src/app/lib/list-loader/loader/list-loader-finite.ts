import { Observable } from 'rxjs';
import { toHttpParams } from '../../utility/http';
import { DataFetcher } from './data-fetcher';
import { ListLoader } from './list-loader';

export class ListLoaderFinite<
    DataFetcherItem,
    Item = DataFetcherItem
> extends ListLoader<DataFetcherItem, Item> {
    protected getDataRequest(
        dataFetcher: DataFetcher<DataFetcherItem>
    ): Observable<DataFetcherItem[]> {
        return dataFetcher(toHttpParams(this.params));
    }
}

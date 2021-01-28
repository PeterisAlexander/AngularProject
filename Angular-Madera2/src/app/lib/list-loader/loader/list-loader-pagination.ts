import { isArray } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryParamModel } from '../../http/query-param.model';
import { toHttpParams } from '../../utility/http';
import { DataFetcher } from './data-fetcher';
import { ListLoader } from './list-loader';

interface DataWithTotalModel<DataFetcherItem> {
    elements: DataFetcherItem[];
    total: number;
}

export class ListLoaderPagination<
    DataFetcherItem,
    Item = DataFetcherItem
> extends ListLoader<DataFetcherItem, Item> {
    public count = 50;

    public page = 1;

    public total: number;

    public getData(): void {
        this.clean();
        super.getData(this.count);
    }

    public getPage(page: number): void {
        this.page = page;

        this.getData();
    }

    public reload(): void {
        this.getPage(1);
    }

    public setDataFetcher(
        dataFetcher:
            | DataFetcher<DataFetcherItem>
            | DataFetcher<DataFetcherItem>[]
    ): void {
        // Le ListLoaderPagination ne peut pas gérer plusieurs dataFetcher
        // car il faudrait pouvoir cela savoir le total d'élément par dataFetcher
        // (possible actuellement si on récupère la 1ère page de données de chaque dataFetcher = pas top)
        if (isArray(dataFetcher)) {
            throw Error(
                'Le ListLoaderPagination ne peut pas gérer plusieurs dataFetcher'
            );
        }

        super.setDataFetcher(dataFetcher);
    }

    protected getDataRequest(
        dataFetcher: DataFetcher<DataFetcherItem>,
        itemsLoaded: number,
        amount: number
    ): Observable<DataFetcherItem[]> {
        const params: QueryParamModel = {
            ...this.params,
            top: amount,
            skip: (this.page - 1) * amount,
        };

        return dataFetcher(toHttpParams(params)).pipe(
            map((data) => {
                if (isArray(data)) {
                    return data;
                }

                // Cas particulier encore présent sur la recherche siren où la requête ne ramène pas la liste
                // mais un objet avec 2 propriétés (total et elements), cette façon ne devrait plus être utilisée,
                // il faut réfléchir à passer des méta données dans l'entête de la requête
                const wrapper = data as DataWithTotalModel<DataFetcherItem>;
                this.total = wrapper.total;

                return wrapper.elements;
            })
        );
    }
}

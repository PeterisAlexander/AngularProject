import { of } from 'rxjs';
import { DataFetcher } from '../loader/data-fetcher';
import { PreparedGroupedData } from './prepare-grouped-data';

/**
 * Simule une fonction de récupération de données
 */
export const listLoaderEmpty: DataFetcher<any> = () => of([]);

/**
 * Fonction à passer au prepareData d'un ListLoader pour transformer les données en les regroupant
 */
export function prepareGroupedData<ListItem>(
    prepare: (
        groupBy: (propName: string) => PreparedGroupedData<ListItem>
    ) => void
) {
    return (data: ListItem[]): any[] => {
        const transformer = new PreparedGroupedData(data);

        prepare(transformer.groupBy.bind(transformer));

        // Uniquement nécessaire au fonctionne du prepareData des ListLoader
        return data;
    };
}

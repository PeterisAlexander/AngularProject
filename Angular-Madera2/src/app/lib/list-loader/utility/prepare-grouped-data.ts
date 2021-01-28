import { first, isEqual, last } from 'lodash';
import { groupBy } from '../../utility/array';
import { GroupingModel } from '../../utility/array/group-by/grouping.model';
import { ListLoader } from '../loader/list-loader';

export class PreparedGroupedData<ListItem> {
    private _groupByFunctions: ((
        data: any[]
    ) => GroupingModel<any, any>[])[] = [];

    public constructor(private _list: ListItem[]) {}

    public groupBy(propName: string): PreparedGroupedData<ListItem> {
        this._groupByFunctions.push((d) => groupBy<any, any>(d, propName));

        return this;
    }

    public merge<Item extends GroupingModel<any, any>>(data: Item[]): Item[] {
        let result = this._list as any[];

        this._groupByFunctions.forEach((fn) => (result = fn(result)));

        return this.mergeInternal(data, result);
    }

    private mergeInternal<Item extends GroupingModel<any, any>>(
        listA: Item[],
        listB: Item[],
        iteration = 0
    ): Item[] {
        const nbMergeIterations = this._groupByFunctions.length;
        const lastA = last(listA);
        const firstB = first(listB);

        if (
            lastA != null &&
            firstB != null &&
            isEqual(lastA.value, firstB.value)
        ) {
            listB.shift();

            if (iteration < nbMergeIterations - 1) {
                lastA.items = this.mergeInternal(
                    lastA.items,
                    firstB.items,
                    iteration + 1
                );
            }

            lastA.items = [...lastA.items, ...firstB.items];
        }

        return [...listA, ...listB];
    }
}

import { Observable, of } from 'rxjs';
import { toHttpParams } from '../../utility/http';
import { DataFetcher } from './data-fetcher';
import { ListLoader } from './list-loader';

// Classe de test permettant de tester la classe abstraite ListLoader
class ListLoaderTest<
    DataFetcherItem,
    Item = DataFetcherItem
> extends ListLoader<DataFetcherItem, Item> {
    protected getDataRequest(
        dataFetcher: DataFetcher<DataFetcherItem>
    ): Observable<DataFetcherItem[]> {
        return dataFetcher(toHttpParams(this.params));
    }
}

describe('ListLoader', () => {
    it('doit se créer', () => {
        const loader = new ListLoaderTest((p) => of([]));
        expect(loader).toBeTruthy();
    });

    it('patchParams doit mettre à jour partiellement les paramêtres de requête', () => {
        const loader = new ListLoaderTest((p) => of([]));
        const p1 = { un: 1 };
        const p2 = { un: 2 };

        expect(loader.params).toEqual({});

        loader.setParams(p1);
        expect(loader.params).toEqual(p1);

        loader.patchParams(p2);
        expect(loader.params).toEqual({ ...p1, ...p2 });
    });

    it('setParams doit définir de nouveaux paramêtres de requête', () => {
        const loader = new ListLoaderTest((p) => of([]));
        const p1 = { un: 1 };
        const p2 = { deux: 2 };

        expect(loader.params).toEqual({});
        expect(loader.hasParam).toBeFalsy();

        loader.setParams(p1);
        expect(loader.params).toEqual(p1);
        expect(loader.hasParam).toBeTruthy();

        loader.setParams(p2);
        expect(loader.params).toEqual(p2);
    });

    it('patchParams et setParams doivent nettoyer les paramètres', () => {
        const loader = new ListLoaderTest((p) => of([]));
        const p1 = { un: 1, pasUn: null, niUn: '' };
        const p2 = { deux: 2, pasDeux: null, niDeux: '' };

        expect(loader.params).toEqual({});

        loader.setParams(p1);
        expect(loader.params).toEqual({ un: 1 });

        loader.patchParams(p2);
        expect(loader.params).toEqual({ un: 1, deux: 2 });
    });

    it('params doit être passer en paramètre du dataFetcher', (done) => {
        const params = { un: '1' };
        const loader = new ListLoaderTest((p) => {
            expect(p.get('un')).toBe(params.un);
            done();
            return of([]);
        });

        loader.setParams(params);
        loader.getData();
    });

    it("isLoading doit changer d'état lors de la récupération des données", (done) => {
        const loader = new ListLoaderTest((p) => of([]));
        const expected = [false, true, false];
        const result: boolean[] = [];

        loader.isLoading.subscribe((isLoading) => {
            result.push(isLoading);

            if (result.length === 3) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it("isEmpty doit indiquer s'il y a des données", (done) => {
        const loader = new ListLoaderTest((p) => of([1, 2, 3]));
        const expected = [true, false];
        const result: boolean[] = [];

        loader.isEmpty.subscribe((isEmpty) => {
            result.push(isEmpty);

            if (result.length === 2) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it('getData doit récupérer toutes les données du dataFetcher et valoriser data', (done) => {
        const dfResult = [1, 2, 3, 4, 5];
        const loader = new ListLoaderTest((p) => of(dfResult));

        const expected = [[], dfResult];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it('getData doit récupérer toutes les données des dataFetchers et valoriser data', (done) => {
        const dfResult1 = [1, 2, 3, 4, 5];
        const dfResult2 = [6, 7, 8, 9, 10];
        const loader = new ListLoaderTest([
            (p) => of(dfResult1),
            (p) => of(dfResult2),
        ]);

        const expected = [[], [...dfResult1, ...dfResult2]];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it("clean doit supprimer toutes les données et déclencher l'événement cleaned", (done) => {
        const dfResult = [1, 2, 3, 4, 5];
        const loader = new ListLoaderTest((p) => of(dfResult));

        const expected = [[], dfResult, []];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                loader.clean();
            }

            if (result.length === 3) {
                expect(result).toEqual(expected);
            }
        });

        loader.cleaned.subscribe(() => done());

        loader.getData();
    });

    it('reload doit supprimer toutes les données et demander de nouvelles données', (done) => {
        const dfResult = [1, 2, 3, 4, 5];
        const loader = new ListLoaderTest((p) => of(dfResult));

        const expected = [[], dfResult, [], dfResult];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                loader.reload();
            }

            if (result.length === 4) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it('prepareData doit permettre la transformation des données à leur retour', (done) => {
        const dfResult = [1, 2, 3, 4, 5];
        const loader = new ListLoaderTest<number>((p) => of(dfResult));

        loader.prepareData = (data) => data.map((i) => i * 2);

        const expected = [[], dfResult.map((i) => i * 2)];
        const result: number[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 2) {
                expect(result).toEqual(expected);
                done();
            }
        });

        loader.getData();
    });

    it('search doit recharger la liste de données tout en spécifiant le paramètre searchValue', (done) => {
        const query = 'query';
        const loader = new ListLoaderTest((p) => of([p.get('searchValue')]));

        const expected = [[], [], [query]];
        const result: string[][] = [];

        loader.data.subscribe((data) => {
            result.push(data);

            if (result.length === 3) {
                expect(loader.params.searchValue).toEqual(query);
                expect(result).toEqual(expected);
                done();
            }
        });

        expect(loader.params).toEqual({});

        loader.search(query);
    });

    it('compareWith doit pouvoir comparer 2 valeurs sont égales', () => {
        const loader = new ListLoaderTest((p) => of([]));

        expect(loader.compareWith(null, null)).toBeTruthy();
        expect(loader.compareWith(null, undefined)).toBeFalsy();
        expect(loader.compareWith(1, 1)).toBeTruthy();
        expect(loader.compareWith('1', '1')).toBeTruthy();
        expect(loader.compareWith(1, '1')).toBeFalsy();
        expect(loader.compareWith({}, {})).toBeFalsy();
        expect(loader.compareWith({ id: 1 }, { id: 1 })).toBeTruthy();
        expect(loader.compareWith({ id: 1 }, { id: 2 })).toBeFalsy();
    });

    it("getSingleItem doit retourner un élément si l'ensemble des dataFetcher ne retourne qu'un élément", (done) => {
        let counter = 0;
        const allDone = (): void => {
            counter++;

            if (counter === 3) {
                done();
            }
        };

        const loader1 = new ListLoaderTest((p) => of([1, 2, 3]));
        loader1.getSingleItem().subscribe((item) => {
            expect(item).toBeNull();
            allDone();
        });

        const loader2 = new ListLoaderTest([(p) => of([]), (p) => of([1])]);
        loader2.getSingleItem().subscribe((item) => {
            expect(item).toBe(1);
            allDone();
        });

        const loader3 = new ListLoaderTest([
            (p) => of([]),
            (p) => of([1]),
            (p) => of([2]),
        ]);
        loader3.getSingleItem().subscribe((item) => {
            expect(item).toBeNull();
            allDone();
        });
    });
});

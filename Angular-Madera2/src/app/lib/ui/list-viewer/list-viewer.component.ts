import {
    Component,
    Input,
    TemplateRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { ListLoader } from '../../list-loader/loader/list-loader';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ListLoaderFinite } from '../../list-loader/loader/list-loader-finite';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';
import { merge, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormArray } from '@angular/forms';
import { isArray } from 'lodash';

/**
 * Composant permettant d'afficher le contenu d'une liste
 * avec des états de chargement (loading, empty, noMoreData)
 */
@Component({
    selector: 'app-list-viewer',
    templateUrl: './list-viewer.component.html',
    styleUrls: ['./list-viewer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListViewerComponent implements HandlePropertyChange {
    @Input()
    public emptyWithFilterTemplate: TemplateRef<any>;

    @Input()
    public emptyWithoutFilterTemplate: TemplateRef<any>;

    public isEmpty = of(false);

    public isLoading = of(false);

    @Input()
    @ListenPropertyChange()
    public list: ListLoader<any> | any[] | FormArray;

    public get isFiltered(): boolean {
        return this.list instanceof ListLoader ? this.list.hasParam : false;
    }

    public constructor(private _changeDectorRed: ChangeDetectorRef) {}

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.list) {
            this.handleList();
        }
    }

    private handleList(): void {
        this.isLoading =
            this.list instanceof ListLoader ? this.list.isLoading : of(false);

        if (isArray(this.list)) {
            this.isEmpty = of(this.list.length === 0);
            this._changeDectorRed.markForCheck();

            return;
        }

        if (this.list instanceof FormArray) {
            const formArray = this.list;
            this.isEmpty = merge(of(null), formArray.valueChanges).pipe(
                map(() => formArray.controls.length === 0)
            );
            this._changeDectorRed.markForCheck();

            return;
        }

        const listLoader = this.list;
        this.isEmpty = listLoader.isEmpty;

        this._changeDectorRed.markForCheck();

        if (listLoader instanceof ListLoaderFinite) {
            listLoader.getData();
        }
    }
}

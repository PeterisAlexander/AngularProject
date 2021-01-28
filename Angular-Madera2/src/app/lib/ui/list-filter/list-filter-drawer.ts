import { FormGroup } from '@angular/forms';
import { isObject, isArray } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { getFormValue } from 'src/app/lib/utility/form';
import { ListenPropertyChange } from '../../decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from '../../decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from '../../decorator/property-change/change-by-property.model';
import { ListFilterDrawerModel } from './list-filter-drawer.model';

export abstract class ListFilterDrawer<TFilterFormModel>
    implements ListFilterDrawerModel<any>, HandlePropertyChange {
    @ListenPropertyChange()
    public form: FormGroup;

    public hasFilters = false;

    public shown = false;

    public submit = new BehaviorSubject<any>(null);

    private _defaultFilters = {};

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.form) {
            this._defaultFilters = changes.form.currentValue.value;
        }
    }

    public handleReset(): void {
        this.form.reset(this._defaultFilters);
        this.handleSubmit();
    }

    public handleSubmit(): void {
        this.updateHasFilters();
        this.submit.next(
            this.prepareFilters(getFormValue<TFilterFormModel>(this.form))
        );
        this.shown = false;
    }

    protected prepareFilters(filters: TFilterFormModel): any {
        return filters;
    }

    private updateHasFilters(): void {
        // est considéré comme filtre actif toutes (sous) propriétés dont la valeur n'est ni null/undefined ni false
        const check = (obj: any): boolean => {
            if (isArray(obj)) {
                return obj.some(check);
            }

            if (isObject(obj) && !(obj instanceof Date)) {
                return Object.keys(obj).some((prop) => check(obj[prop]));
            }

            return obj != null && obj !== false;
        };

        this.hasFilters = check(this.prepareFilters(this.form.value));
    }
}

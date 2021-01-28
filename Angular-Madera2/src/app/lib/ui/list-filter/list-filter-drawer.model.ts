import { BehaviorSubject } from 'rxjs';

export interface ListFilterDrawerModel<Filter> {
    hasFilters: boolean;

    shown: boolean;

    submit: BehaviorSubject<Filter>;
}

import { CalendarCustomRangeModel } from './calendar-custom-range.model';

export interface CalendarDayClickModel {
    date: Date;
    range?: CalendarCustomRangeModel;
}

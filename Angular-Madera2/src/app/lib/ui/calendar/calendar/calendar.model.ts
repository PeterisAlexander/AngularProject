import { EventFormModel } from '../event-form/event-form.model';
import { Observable } from 'rxjs';
import { AsyncValidatorFn } from '@angular/forms';
import { WeekDay } from '@angular/common';
import { IntervalModel } from 'src/app/core/utility/interval/interval.utility';
import { DeleteResponse } from 'src/app/lib/rest/delete.response';

export type WeekWorkTimeModel = Partial<Record<WeekDay, IntervalModel[]>>;

export interface CalendarOptionModel {
    asyncValidatorFactories?: Array<(event: EventModel) => AsyncValidatorFn>;
    calendarState: CalendarStateModel;
    dateMax?: Date;
    dateMin?: Date;
    onCellSelection?: (
        selectEvent: CalendarCellSelectionEventModel,
        calendarState: CalendarStateModel
    ) => void;
    onDelete: (eventId: number) => Observable<DeleteResponse>;
    onEventClick?: (
        event: CalendarEventClickEventModel,
        calendarState: CalendarStateModel
    ) => void;
    onFormSubmit?: (
        formValue: EventFormModel,
        event?: EventModel
    ) => Observable<EventModel>;
    workTime?: WeekWorkTimeModel;
}

export interface CalendarCellSelectionEventModel {
    dateEnd: Date;
    dateStart: Date;
    isAllDay: boolean;
}

export interface CalendarEventClickEventModel {
    id: number;
}

export interface CalendarStateModel {
    date: Date;
    view: string;
}

export interface EventModel<Extra = any> {
    color?: string;
    dateEnd: Date;
    dateStart: Date;
    extra?: Extra;
    id: number;
    isAllDay: boolean;
}

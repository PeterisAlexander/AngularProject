import { Component, Input, HostBinding } from '@angular/core';
import { CalendarCustomRangeModel } from '../calendar-custom-range.model';
import { CalendarSelectionEnum } from '../calendar-selection.enum';
import moment from 'moment';
import { DisabledDayModel } from '../disabled-day.model';
import { CALENDAR_MONTH_FORMAT } from '../calendar-month/calendar-month.component';
import { CalendarDayClickModel } from '../calendar-day-click.model';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';

@Component({
    selector: 'app-calendar-multi-month',
    templateUrl: './calendar-multi-month.component.html',
    styleUrls: ['./calendar-multi-month.component.css']
})
export class CalendarMultiMonthComponent implements HandlePropertyChange {
    @Input()
    @HostBinding('class.calendarMultiMonth-compact')
    public compact = true;

    @Input()
    public customRanges: CalendarCustomRangeModel[] = [];

    @Input()
    public dayClick: (day: CalendarDayClickModel) => void;

    @Input()
    public disabledDays: DisabledDayModel[] = [];

    /**
     * Date ou mois au format momentjs CALENDAR_MONTH_FORMAT qui sera le dernier mois affiché
     */
    @Input()
    @ListenPropertyChange()
    public monthEnd: string | Date;

    /**
     * Date ou mois au format momentjs CALENDAR_MONTH_FORMAT qui sera le 1er mois affiché
     */
    @Input()
    @ListenPropertyChange()
    public monthStart: string | Date;

    public monthsList: string[] = [];

    @Input()
    public selection = CalendarSelectionEnum.none;

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.monthStart || changes.monthEnd) {
            this.setMonthsList();
        }
    }

    private setMonthsList(): void {
        if (this.monthStart == null || this.monthEnd == null) {
            this.monthsList = [];
            return;
        }

        /* Moment est laxiste on fait donc deux traitement en un ici:
         * - soit on passe une date au format YYYYMM et il le recupere bien
         * - soit c'est une date, auquel cas il ne recupere pas que le mois d'ou le startOf
         */
        const start = moment(this.monthStart, CALENDAR_MONTH_FORMAT).startOf(
            'month'
        );
        const end = moment(this.monthEnd, CALENDAR_MONTH_FORMAT).startOf(
            'month'
        );

        if (start.isAfter(end)) {
            this.monthsList = [];

            throw new Error(
                `monthStart [${this.monthStart}] est plus grand que monthEnd [${this.monthEnd}]`
            );
        }

        const current = moment(start);
        const monthsList = [];

        while (current.isSameOrBefore(end)) {
            monthsList.push(current.format(CALENDAR_MONTH_FORMAT));
            current.add(1, 'month');
        }

        this.monthsList = monthsList;
    }
}

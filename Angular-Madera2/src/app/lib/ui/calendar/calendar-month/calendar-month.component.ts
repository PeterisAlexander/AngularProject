import { Component, Input } from '@angular/core';
import { CalendarSelectionEnum } from '../calendar-selection.enum';
import { CalendarCustomRangeModel } from '../calendar-custom-range.model';
import moment, { Moment } from 'moment';
import { isString } from 'lodash';
import { CalendarCellStyle } from '../calendar-cell-style.model';
import { DisabledDayModel } from '../disabled-day.model';
import { mostContrasted } from 'src/app/lib/utility/color';
import { CalendarDayClickModel } from '../calendar-day-click.model';
import { CssStyleModel } from 'src/app/lib/model/css-style.model';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';

export const CALENDAR_MONTH_FORMAT = 'YYYYMM';

const CALENDAR_BACKGROUND_COLOR = '#FFF';
const DAY_DISABLED_TEXT_COLOR_DARK = 'hsla(0 , 100%, 100%, 0.5)';
const DAY_DISABLED_TEXT_COLOR_LIGHT = 'hsla(0 , 0%, 0%, 0.27)';
const DAY_TEXT_COLOR_DARK = '#FFF';
const DAY_TEXT_COLOR_LIGHT = 'hsla(0 , 0%, 0%, 0.85)';
const SEMI_BOLD_WEIGHT = 600;

interface DayModel {
    date: Moment;
    disabled: boolean;
    inMonth: boolean;
    inRange?: boolean;
    isFirstOfRange?: boolean;
    isFirstOfWeek: boolean;
    isLastOfRange?: boolean;
    isLastOfWeek: boolean;
    tooltip?: string;
    range?: CalendarCustomRangeModel;
    style: CssStyleModel;
}

@Component({
    selector: 'app-calendar-month',
    templateUrl: './calendar-month.component.html',
    styleUrls: ['./calendar-month.component.css']
})
export class CalendarMonthComponent implements HandlePropertyChange {
    @Input()
    public canChangeMonth = true;

    @Input()
    @ListenPropertyChange()
    public customRanges: CalendarCustomRangeModel[] = [];

    public days: DayModel[] = [];

    @Input()
    public dayClick: (day: CalendarDayClickModel) => void;

    @Input()
    @ListenPropertyChange()
    public disabledDays: DisabledDayModel[] = [];

    /**
     * Date ou mois au format momentjs CALENDAR_MONTH_FORMAT dont le mois sera affiché
     */
    @Input()
    @ListenPropertyChange()
    public month: string | Date;

    public monthName: string;

    @Input()
    public selection = CalendarSelectionEnum.none;

    public weekDays = moment.weekdaysMin(true);

    private _customRangesInMonth: CalendarCustomRangeModel[] = [];

    private _firstDayInMonth: Moment;

    private _lastDayInMonth: Moment;

    public dayClicked(day: DayModel): void {
        if (day.disabled) {
            return;
        }

        if (this.dayClick) {
            this.dayClick({
                date: day.date.toDate(),
                range: day.range
            });
        }
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.month) {
            this.handleMonthChange();
            this.prepareCustomRanges();
            this.setDaysState();
        }

        if (
            changes.month == null &&
            (changes.customRanges || changes.disabledDays)
        ) {
            this.prepareCustomRanges();
            this.setDaysState();
        }
    }

    private buildDays(): void {
        const firstDay = moment(this._firstDayInMonth).startOf('week');
        const lastDay = moment(this._firstDayInMonth)
            .endOf('month')
            .endOf('week');

        const days: DayModel[] = [];
        const currentDay = moment(firstDay);

        while (currentDay.isSameOrBefore(lastDay)) {
            const newDay = moment(currentDay);

            days.push({
                date: newDay,
                disabled: false,
                inMonth: newDay.isSame(this._firstDayInMonth, 'month'),
                isFirstOfWeek: newDay.weekday() === 0,
                isLastOfWeek: newDay.weekday() === 6,
                style: {}
            });

            currentDay.add(1, 'day');
        }

        this.days = days;
    }

    private getDayStyle(
        disabled: boolean,
        rangeStyle: CalendarCellStyle = {}
    ): CssStyleModel {
        const style: CssStyleModel = {};
        const backgroundColor = rangeStyle.backgroundColor
            ? rangeStyle.backgroundColor
            : CALENDAR_BACKGROUND_COLOR;

        if (disabled) {
            style.color = mostContrasted(
                backgroundColor,
                DAY_DISABLED_TEXT_COLOR_LIGHT,
                DAY_DISABLED_TEXT_COLOR_DARK
            );
        } else if (rangeStyle.textColor) {
            style.color = rangeStyle.textColor;
        } else if (rangeStyle.backgroundColor) {
            style.color = mostContrasted(
                backgroundColor,
                DAY_TEXT_COLOR_LIGHT,
                DAY_TEXT_COLOR_DARK
            );
        } else {
            style.color = DAY_TEXT_COLOR_LIGHT;
        }

        style.backgroundColor = rangeStyle.backgroundColor;
        style.borderColor = rangeStyle.borderColor;
        style.fontWeight = rangeStyle.isBold ? SEMI_BOLD_WEIGHT : null;

        return style;
    }

    private handleMonthChange(): void {
        if (!isString(this.month)) {
            throw new Error(`Le mois à afficher n'est pas renseigné`);
        }

        /* Moment est laxiste on fait donc deux traitement en un ici:
         * - soit on passe une date au format YYYYMM et il le recupere bien
         * - soit c'est une date, auquel cas il ne recupere pas que le mois d'ou le startOf
         */
        this._firstDayInMonth = moment(
            this.month,
            CALENDAR_MONTH_FORMAT
        ).startOf('month');
        this._lastDayInMonth = moment(this._firstDayInMonth)
            .add(1, 'month')
            .add(-1, 'day');
        this.monthName = this._firstDayInMonth.format('MMMM YYYY');

        this.buildDays();
    }

    private isDisableDay(day: Moment): boolean {
        return this.disabledDays.some(rule => {
            if ('after' in rule) {
                return day.isAfter(rule.after, 'day');
            }

            if ('before' in rule) {
                return day.isBefore(rule.before, 'day');
            }

            if ('day' in rule) {
                return day.isSame(rule.day, 'day');
            }

            if ('range' in rule) {
                return day.isBetween(rule.range[0], rule.range[1], 'day', '[]');
            }
        });
    }

    private prepareCustomRanges(): void {
        this.customRanges.forEach(range => {
            if (
                range.dateStart == null ||
                range.dateEnd == null ||
                range.dateStart > range.dateEnd
            ) {
                throw new Error(
                    `Les dates de la période sont invalides : début [${range.dateStart}], fin [${range.dateEnd}]`
                );
            }
        });

        this._customRangesInMonth = this.customRanges
            .filter(range => {
                return (
                    this._firstDayInMonth.isSameOrBefore(range.dateEnd) &&
                    this._lastDayInMonth.isSameOrAfter(range.dateStart)
                );
            })
            // le tri des customRanges permet en cas de multi customRanges pour une date
            // de prioriser le 1er pour l'affichage
            .sort((a, b) => {
                const startA = moment(a.dateStart);
                const endA = moment(a.dateEnd);
                const startB = moment(b.dateStart);
                const endB = moment(b.dateEnd);

                if (startA.isSame(startB, 'day')) {
                    return endA.isSameOrBefore(endB, 'day') ? -1 : 1;
                }

                return startA.isSameOrBefore(startB, 'day') ? -1 : 1;
            });
    }

    private setDaysState(): void {
        this.days.forEach(day => {
            const range = this._customRangesInMonth.find(currentRange => {
                return day.date.isBetween(
                    currentRange.dateStart,
                    currentRange.dateEnd,
                    'day',
                    '[]'
                );
            });

            day.disabled = this.isDisableDay(day.date);

            if (range) {
                day.style = this.getDayStyle(day.disabled, range.style);
                day.inRange = true;
                day.range = range;
                day.isFirstOfRange = day.date.isSame(range.dateStart, 'day');
                day.isLastOfRange = day.date.isSame(range.dateEnd, 'day');
                day.tooltip = range.tooltip;
                return;
            }

            day.style = this.getDayStyle(day.disabled);
        });
    }
}

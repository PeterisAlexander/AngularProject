import {
    Component,
    OnInit,
    Input,
    Inject,
    LOCALE_ID,
    OnDestroy,
    ElementRef,
    AfterViewInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { ListenPropertyChange } from 'src/app/lib/decorator/property-change/listen-property-change.decorator';
import { HandlePropertyChange } from 'src/app/lib/decorator/property-change/handle-property-change';
import { ChangeByPropertyModel } from 'src/app/lib/decorator/property-change/change-by-property.model';
import { CalendarOptionModel, EventModel } from './calendar.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, Observable, fromEvent, merge } from 'rxjs';
import {
    takeUntil,
    debounceTime,
    map,
    distinctUntilChanged,
} from 'rxjs/operators';
import {
    minutesToString,
    timeToMinute,
} from 'src/app/core/utility/date/date.utility';
import {
    TimeScaleModel,
    RenderCellEventArgs,
    SelectEventArgs,
    NavigatingEventArgs,
    EventRenderedArgs,
    EventSettingsModel,
    ScheduleComponent,
} from '@syncfusion/ej2-angular-schedule';
import {
    isIntersecting,
    percentIntersect,
    IntervalModel,
} from 'src/app/core/utility/interval/interval.utility';
import { DataManager } from '@syncfusion/ej2-data';
import { flatMap } from 'lodash';

const backgroundColors = {
    colored: 'var(--neutral6)',
    light: 'var(--gray2)',
};

const defaults: CalendarOptionModel = {
    asyncValidatorFactories: [],
    calendarState: {
        view: 'WorkWeek',
        date: new Date(),
    },
    dateMax: new Date(2099, 11, 31),
    dateMin: new Date(2020, 0, 1),
    onDelete: null,
    onFormSubmit: null,
    workTime: {
        1: [{ start: 0, length: 1440 }],
        2: [{ start: 0, length: 1440 }],
        3: [{ start: 0, length: 1440 }],
        4: [{ start: 0, length: 1440 }],
        5: [{ start: 0, length: 1440 }],
    },
};

const defaultEventSettings: EventSettingsModel = {
    allowAdding: false,
    allowDeleting: false,
    allowEditing: false,
    enableTooltip: false,
    fields: {
        id: 'id',
        isAllDay: { name: 'isAllDay' },
        startTime: { name: 'dateStart' },
        endTime: { name: 'dateEnd' },
    },
};

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent
    implements OnDestroy, OnInit, AfterViewInit, HandlePropertyChange {
    public backgrounds = new Map<Date, string>();

    @Input()
    @ListenPropertyChange()
    public dataSource: DataManager | EventModel[];

    // il faut définir une valeur dès le départ (surtout pour la propriété fields)
    // pour éviter un bug qui empêche la création d'un événement :
    // https://ymag-dev.visualstudio.com/Arya/_workitems/edit/5927
    // c'est juste une question de timing, le schedule créé un objet (EventWindow)
    // qui duplique la configuration des fields et s'il n'a pas encore le bon paramétrage
    // c'est les valeurs par défaut qui sont utilisées (StartTime au lieu de dateStart, etc)
    public eventSettings = defaultEventSettings;

    public firstDayOfTheWeek: number;

    public height: Observable<number>;

    public hourEnd = minutesToString(1440);

    public hourStart = minutesToString(0);

    public locale: string;

    @Input()
    public monthTpl: TemplateRef<EventModel>;

    @Input()
    @ListenPropertyChange()
    public options = defaults;

    public timeScale: TimeScaleModel = {
        enable: true,
        interval: 60,
        slotCount: 2,
    };

    @Input()
    public weekTpl: TemplateRef<EventModel>;

    public workDays = [1, 2, 3, 4, 5];

    private _destroy = new Subject<void>();

    private get _events(): EventModel[] {
        return (this._schedule?.eventsData as EventModel[]) || [];
    }

    private get _firstHour(): number {
        const hours: number[] = [
            ...(this._events?.map((e) => timeToMinute(e.dateStart)) || []),
            ...flatMap(
                Object.values(this.options.workTime || {}).map((list) =>
                    list.map((t) => t.start)
                )
            ),
        ];

        if (hours.length === 0) {
            return 0;
        }

        return Math.min(...hours);
    }

    @ViewChild('schedule')
    private _schedule: ScheduleComponent;

    private _updateHeight = new Subject<void>();

    public constructor(
        @Inject(LOCALE_ID)
        private _fullLocale: string,
        private _modal: NzModalService,
        private _elementRef: ElementRef
    ) {}

    public eventClick(event: EventModel): void {
        if (this.options.onEventClick == null) {
            return;
        }

        this.options.onEventClick({ id: event.id }, this.options.calendarState);
    }

    public handlePropertyChange(changes: ChangeByPropertyModel): void {
        if (changes.options) {
            this.completeOptions();
        }

        if (changes.dataSource) {
            this.onDataSourceChange();
        }
    }

    public navigating(event: NavigatingEventArgs): void {
        if (event.action === 'view' && this.options.calendarState) {
            this.options.calendarState.view = event.currentView;
        }

        if (event.action === 'date' && this.options.calendarState) {
            this.options.calendarState.date = event.currentDate;
        }
    }

    public ngAfterViewInit(): void {
        this._updateHeight.next();
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
        this._updateHeight.complete();
    }

    public ngOnInit(): void {
        this.locale = this._fullLocale.split('-')[0];
        this.firstDayOfTheWeek = getLocaleFirstDayOfWeek(this._fullLocale);
        this.setComponentHeight();
    }

    public onDataBound(): void {
        this.scrollToFirstEvent();
    }

    public onEventRendered(args: EventRenderedArgs): void {
        const color = args.data.color as string;

        if (!args.element || !color) {
            return;
        }

        args.element.style.backgroundColor = color;
        args.element.style.borderColor = color;
        args.element.style.display = 'flex';
    }

    public renderCell(data: RenderCellEventArgs): void {
        if (data.elementType !== 'workCells') {
            return;
        }

        data.element.setAttribute(
            'style',
            `background: ${this.getCellBackground(data.date)};`
        );
    }

    public select(selectEvent: SelectEventArgs): void {
        if (
            selectEvent.requestType !== 'cellSelect' ||
            this.options.onCellSelection == null
        ) {
            return;
        }

        this.options.onCellSelection(
            {
                dateEnd: new Date(selectEvent.data['dateEnd']),
                dateStart: new Date(selectEvent.data['dateStart']),
                isAllDay: selectEvent.data['isAllDay'],
            },
            this.options.calendarState
        );
    }

    private completeOptions(): void {
        Object.keys(defaults).forEach((key) => {
            if (!this.options[key]) {
                this.options[key] = defaults[key];
            }
        });

        this.workDays = Object.keys(this.options.workTime).map((day) => +day);
    }

    private getCellBackground(cellDateStart: Date): string {
        if (this.backgrounds.has(cellDateStart)) {
            return this.backgrounds.get(cellDateStart);
        }

        const cellInterval: IntervalModel = {
            start: timeToMinute(cellDateStart),
            length: this.timeScale.interval / this.timeScale.slotCount,
        };

        const percentIntercepts: IntervalModel[] = this.options.workTime[
            cellDateStart.getDay() === 0 ? 7 : cellDateStart.getDay()
        ]
            ?.filter((e) => isIntersecting(cellInterval, e))
            .map((i) => percentIntersect(cellInterval, i));

        if (!percentIntercepts || percentIntercepts.length === 0) {
            this.backgrounds.set(cellDateStart, backgroundColors.colored);

            return backgroundColors.colored;
        }

        if (
            percentIntercepts.find(
                (i) => i.start === 0 && i.start + i.length === 100
            )
        ) {
            this.backgrounds.set(cellDateStart, backgroundColors.light);

            return backgroundColors.light;
        }

        const gradients = [backgroundColors.colored];

        percentIntercepts.forEach((percentIntercept) => {
            const grandientStart = `${backgroundColors.colored} ${percentIntercept.start}%, ${backgroundColors.light} ${percentIntercept.start}%`;
            const gradientEnd = `${backgroundColors.light} ${
                percentIntercept.start + percentIntercept.length
            }%, ${backgroundColors.colored} ${
                percentIntercept.start + percentIntercept.length
            }%`;
            gradients.push(`${grandientStart}, ${gradientEnd}`);
        });

        gradients.push(backgroundColors.colored);
        const gradient = gradients.join(', ');

        const backgroundGradient = `linear-gradient(to bottom, ${gradient})`;
        this.backgrounds.set(cellDateStart, backgroundGradient);

        return backgroundGradient;
    }

    private onDataSourceChange(): void {
        this.setEventSettings();
        this.scrollToFirstEvent();
    }

    private scrollToFirstEvent(): void {
        // Obligé de rendre le code asynchrone sinon on a une erreur sur le schedule
        // lorsque cette méthode est appelée via l'événement dataBound :
        //   Cannot read property 'scrollToDate' of undefined
        // Pire encore, lors d'une navigation cela fonctionne bien mais lors d'un F5
        // le positionnement ne se fait pas (données récupérées avant l'affichage réelle du schedule ?),
        // donc on rajoute un delay (200ms => fonctionne bien sous chrome et ffx).
        // L'événement dataBound est surement déclenché trop tôt pour ce que l'on veut faire
        // mais à défaut de pouvoir utiliser autre chose...
        setTimeout(
            () => this._schedule?.scrollTo(minutesToString(this._firstHour)),
            200
        );
    }

    private setComponentHeight(): void {
        this.height = merge(
            this._updateHeight,
            fromEvent(window, 'resize')
        ).pipe(
            takeUntil(this._destroy),
            debounceTime(250),
            map(() => {
                return (
                    window.innerHeight -
                    this._elementRef.nativeElement.getBoundingClientRect().y
                );
            }),
            distinctUntilChanged()
        );
    }

    private setEventSettings(): void {
        this.eventSettings = {
            ...defaultEventSettings,
            dataSource: this.dataSource,
        };
    }
}

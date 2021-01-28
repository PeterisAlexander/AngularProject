import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Output,
    EventEmitter
} from '@angular/core';
import {
    FormGroup,
    ValidatorFn,
    AsyncValidatorFn,
    AbstractControl
} from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, finalize, catchError } from 'rxjs/operators';
import moment from 'moment';
import { isFunction } from 'lodash';

import {
    ValidateForm,
    getFormValue,
    disableForm,
    enableForm
} from 'src/app/lib/utility/form';
import { timeToMinute } from 'src/app/core/utility/date/date.utility';
import { SubmittableComponent } from 'src/app/lib/ui/calendar/submittable-component';
import { EventModel } from 'src/app/lib/ui/calendar/calendar/calendar.model';
import { eventFormFactory, EventFormModel } from './event-form.model';

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.css']
})
export class EventFormComponent
    implements OnDestroy, OnInit, SubmittableComponent {
    @Input()
    public asyncValidatorFactories: Array<
        (event: EventModel) => AsyncValidatorFn
    >;

    public get duree(): number {
        return timeToMinute(
            this.form.get('dates.dateStart').value,
            this.form.get('dates.dateEnd').value
        );
    }

    @Input()
    public event: EventModel;

    public form: FormGroup;

    public get isUpdate(): boolean {
        return this.event != null;
    }

    @Input()
    public onDelete: (eventId: number) => Observable<void>;

    @Input()
    public onSubmit: (
        formValue: EventFormModel,
        event?: EventModel
    ) => Observable<EventModel>;

    @Input()
    public prefill: Partial<EventFormModel>;

    @Output()
    public save = new EventEmitter<EventModel>();

    private _destroy = new Subject<void>();

    public delete(): void {
        if (isFunction(this.onDelete) && this.event != null) {
            disableForm(this.form);

            this.onDelete(this.event.id)
                .pipe(takeUntil(this._destroy))
                .subscribe();
        }
    }

    public ngOnDestroy(): void {
        this._destroy.next();
        this._destroy.complete();
    }

    public ngOnInit(): void {
        this.initForm();
    }

    @ValidateForm('form')
    public submit(): void {
        if (isFunction(this.onSubmit)) {
            disableForm(this.form);

            this.onSubmit(getFormValue<EventFormModel>(this.form), this.event)
                .pipe(
                    takeUntil(this._destroy),
                    catchError(err => {
                        this.save.error(err);
                        return of(err);
                    }),
                    finalize(() => enableForm(this.form))
                )
                .subscribe((event: EventModel) => {
                    this.form.markAsPristine();
                    this.save.emit(event);
                });
        }
    }

    private eventRangeValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            if (!control) {
                return null;
            }

            const start = getFormValue<Date>(control, 'dateStart');
            const end = getFormValue<Date>(control, 'dateEnd');

            return start && end && start < end
                ? null
                : {
                      invalidRange: true
                  };
        };
    }

    private initForm(): void {
        this.form = eventFormFactory(
            [this.eventRangeValidator()],
            this.asyncValidatorFactories?.map(fn => fn(this.event))
        );

        if (this.prefill) {
            this.form.patchValue(this.prefill);
        }

        if (this.event) {
            this.form.patchValue({
                ...this.event,
                dates: {
                    dateEnd: this.event.dateEnd,
                    dateStart: this.event.dateStart
                }
            });
        }

        this.form
            .get('dates.dateStart')
            .valueChanges.pipe(takeUntil(this._destroy))
            .subscribe(() => {
                const start = moment(
                    getFormValue<Date>(this.form, 'dates.dateStart')
                );
                const end = moment(
                    getFormValue<Date>(this.form, 'dates.dateEnd')
                );

                if (!end.isSame(start, 'day')) {
                    const diffDays = start
                        .startOf('day')
                        .diff(end.clone().startOf('day'), 'days');

                    this.form
                        .get('dates.dateEnd')
                        .patchValue(end.add(diffDays, 'days').toDate());
                }
            });
    }
}

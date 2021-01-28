import { Directive, OnInit, Optional } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import {
    NzDatePickerComponent,
    NzMonthPickerComponent,
    NzRangePickerComponent,
    NzYearPickerComponent,
    NzWeekPickerComponent,
    SupportTimeOptions,
} from 'ng-zorro-antd/date-picker';
import { convertTokens } from '@date-fns/upgrade/v2';

type Picker =
    | NzDatePickerComponent
    | NzMonthPickerComponent
    | NzRangePickerComponent
    | NzWeekPickerComponent
    | NzYearPickerComponent;

/**
 * Directive permettant de définir automatiquement le format de la date en fonction de la locale
 * pour les composants de sélection de dates de zorro (ex : NzDatePickerComponent)
 *
 * Les composants NzXxxPickerComponent de zorro ne tiennent pas compte de la locale de l'application
 * au niveau du format, il faut le préciser à chaque fois sinon c'est le format EN.
 */
@Directive({
    selector: '[appPickerFormat]',
    exportAs: 'appPickerFormat',
})
export class PickerFormatDirective implements OnInit {
    private get _picker(): Picker {
        return (
            this._datePicker ||
            this._monthPicker ||
            this._rangePicker ||
            this._weekPicker ||
            this._yearPicker
        );
    }

    public constructor(
        @Optional()
        private _datePicker: NzDatePickerComponent,
        private _i18n: NzI18nService,
        @Optional()
        private _monthPicker: NzMonthPickerComponent,
        @Optional()
        private _rangePicker: NzRangePickerComponent,
        @Optional()
        private _weekPicker: NzWeekPickerComponent,
        @Optional()
        private _yearPicker: NzYearPickerComponent
    ) {}

    public ngOnInit(): void {
        this.setFormat();
    }

    private setFormat(): void {
        // Pas joli mais tous les datepickers utilisent le NzDatePickerComponent
        // or zorro n'a pas utilisé d'héritage pour le faire donc le compilateur
        // ne sait pas que les datepickers ont les propriétés nzShowTime, nzFormat, etc
        const picker = this._picker as NzDatePickerComponent;

        // De plus zorro depuis sa v9 utilise date-fns v2, mais les formats utilisés par le NzI18nService utilisent sont encore ceux de la v1.
        // Tant que ces derniers sont en v1, il faut les convertir via l'utilitaire convertTokens() :
        // Tableau de comparaison date-fns v1/v2 :
        // https://github.com/date-fns/date-fns/blob/master/CHANGELOG.md#200---2019-08-20
        // Utilitaire de conversion des formats date-fns v1 => v2 :
        // https://github.com/date-fns/date-fns-upgrade
        if (
            this._picker instanceof NzDatePickerComponent ||
            this._picker instanceof NzRangePickerComponent
        ) {
            const showTime: boolean | SupportTimeOptions = picker.nzShowTime;

            if (showTime instanceof Object && showTime.nzFormat != null) {
                picker.nzFormat = [
                    convertTokens(
                        this._i18n.getLocale().DatePicker.lang.dateFormat
                    ),
                    showTime.nzFormat,
                ].join(' ');
            } else if (picker.nzShowTime === true) {
                picker.nzFormat = convertTokens(
                    this._i18n.getLocale().DatePicker.lang.dateTimeFormat
                );
            } else {
                picker.nzFormat = convertTokens(
                    this._i18n.getLocale().DatePicker.lang.dateFormat
                );
            }
        }

        if (picker instanceof NzWeekPickerComponent) {
            picker.nzFormat = 'yyyy-WW'; // le format n'est pas défini dans la locale, c'est celui par défaut de zorro
        }

        if (picker instanceof NzMonthPickerComponent) {
            picker.nzFormat =
                convertTokens(
                    this._i18n.getLocale().DatePicker.lang.monthFormat
                ) || 'yyyy-MM';
        }

        if (picker instanceof NzYearPickerComponent) {
            picker.nzFormat = convertTokens(
                this._i18n.getLocale().DatePicker.lang.yearFormat
            );
        }
    }
}

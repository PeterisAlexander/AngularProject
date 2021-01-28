import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'lodash';

@Pipe({
    name: 'appNoData',
})
export class NoDataPipe implements PipeTransform {
    public transform(value: string | number): string | number {
        if (
            value == null ||
            value === '' ||
            (isString(value) && value.trim() === '')
        ) {
            return '-';
        }

        return value;
    }
}

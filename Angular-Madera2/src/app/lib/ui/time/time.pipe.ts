import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe permettant de transformer un nombre de minutes en texte decrivant la durée.
 */
@Pipe({
    name: 'appTime'
})
export class TimePipe implements PipeTransform {
    public transform(
        value: number,
        zeroValue: string = '',
        negativeValue: string = ''
    ): string {
        if (value == null) {
            return null;
        }

        if (value === 0) {
            return zeroValue;
        }

        if (value < 0 && negativeValue !== '') {
            return negativeValue;
        }

        const result: string[] = [];

        if (value < 0) {
            value = -value;
            result.push('-');
        }

        const hours = Math.trunc(value / 60);
        const minutes = value % 60;

        result.push(`${hours}h`);

        if (minutes > 0) {
            result.push(`${minutes.toString().padStart(2, '0')}`);
        }

        return result.join('');
    }
}

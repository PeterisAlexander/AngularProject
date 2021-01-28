import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

interface RangeDateModel {
    dateDebut?: Date;
    dateFin?: Date;
}

@Pipe({
    name: 'appRangeDateLabel',
})
export class RangeDateLabelPipe implements PipeTransform {
    public transform(value: RangeDateModel): string {
        if (value == null) {
            return '';
        }

        if (value.dateDebut && value.dateFin) {
            return `Du ${moment(value.dateDebut).format('L')} au ${moment(
                value.dateFin
            ).format('L')}`;
        } else if (value.dateDebut) {
            return `Depuis le ${moment(value.dateDebut).format('L')}`;
        } else if (value.dateFin) {
            return `Jusqu'au ${moment(value.dateFin).format('L')}`;
        }
    }
}

import { CalendarCellStyle } from './calendar-cell-style.model';

/**
 * Interface décrivant la possibilité de personnalisation
 * d'un groupe de cellule (x jours en affichage mois)
 */
export interface CalendarCustomRangeModel<TExtra = any> {
    dateEnd: Date;
    dateStart: Date;
    extra?: TExtra;
    tooltip?: string;
    style?: CalendarCellStyle;
}

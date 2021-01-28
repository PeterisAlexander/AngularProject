export interface DisabledOneDayModel {
    day: Date;
}

export interface DisabledRangeModel {
    range: [Date, Date];
}

export interface DisabledBoundaryModel {
    after?: Date;
    before?: Date;
}

/**
 * Paramétrages possibles pour la désactivation des jours du calendrier
 */
export type DisabledDayModel =
    | DisabledOneDayModel
    | DisabledRangeModel
    | DisabledBoundaryModel;

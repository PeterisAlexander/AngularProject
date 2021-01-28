export interface CompteAccesDroitEntity {
    droitApplicatifs: number[];

    droitMetierDomaines: {
        id: number;
        idDomaine: number;
        idEtatDroitMetier: number;
    }[];

    droitMetierOrganismes: {
        id: number;
        idEtatDroitMetier: number;
        idOrganisme: number;
    }[];

    idDefaultEtatDroitMetierDomaine: number;

    idDefaultEtatDroitMetierOrganisme: number;
}

import { MotCleEntity } from '../commun/mot-cle.entity';

export interface MatiereEntity {
    couleur: string;
    id: number;
    isArchive: boolean;
    isPresentiel: boolean;
    motsCles: MotCleEntity[];
    nom: string;
    reference: string;
}

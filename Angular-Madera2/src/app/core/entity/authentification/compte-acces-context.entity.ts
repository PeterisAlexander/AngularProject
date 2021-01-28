import { CompteAccesEntity } from '../compte/compte-acces.entity';
import { OrganismeFormationEntity } from './organisme-formation.entity';
import { CompteAccesDroitEntity } from './compte-acces-droit.entity';
import { FavoriEntity } from '../compte/favori.entity';

export interface CompteAccesContextEntity {
    compteAcces: CompteAccesEntity;
    droits: CompteAccesDroitEntity;
    favoris: FavoriEntity[];
    organismeFormation: OrganismeFormationEntity;
}

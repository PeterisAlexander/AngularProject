import { OrganismeFormationEntity } from './organisme-formation.entity';
import { CompteAccesEntity } from '../compte/compte-acces.entity';

export interface OrganismeConnectEntity {
    compteAcces: CompteAccesEntity;
    organismeFormation: OrganismeFormationEntity;
}

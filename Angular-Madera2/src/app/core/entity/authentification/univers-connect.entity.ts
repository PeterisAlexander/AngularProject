import { CompteAccesUniversEntity } from '../compte/compte-acces-univers.entity';

/**
 * Interface représentant le résultat de la connexion à un univers
 */
export interface UniversConnectEntity {
    /**
     * Univers sur lequel on est connecté
     */
    compteAccesUnivers: CompteAccesUniversEntity;

    /**
     * Est-ce qu'on est bien connecté
     */
    connected: boolean;
}

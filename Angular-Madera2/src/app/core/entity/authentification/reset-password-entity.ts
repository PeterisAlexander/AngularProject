/**
 * Interface décrivant le retour de la web api pour la mise à jour du mot de passe
 */
export interface ResetPasswordEntity {
    /**
     * Indique si le token est expiré
     */
    tokenExpired: boolean;
}

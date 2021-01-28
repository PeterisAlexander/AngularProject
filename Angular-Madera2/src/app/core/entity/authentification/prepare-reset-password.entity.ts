/**
 * Interface décrivant le retour de la web api pour la préparation de la mise à jour du mot de passe
 */
export interface PrepareResetPasswordEntity {
    /**
     * Indique si c'est la première identification
     */
    firstInitialization: boolean;

    /**
     * Identifiant de l'utilisateur
     */
    login: string;

    /**
     * Indique si le token est expiré
     */
    tokenExpired: boolean;
}

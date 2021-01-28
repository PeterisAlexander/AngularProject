/**
 * Message envoyé à la web api pour la préparation du reset du mot de passe
 */
export interface PrepareResetPasswordRequest {
    /**
     * Token à valider
     */
    token: string;
}

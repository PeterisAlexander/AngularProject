/**
 * Message envoyé à la WepApi lors de la mise à jour du mot de passe
 */
export interface ResetPasswordRequest {
    /**
     * Mot de passe
     */
    newPassword: string;

    /**
     * Jeton permet d'authentifier l'utilisateur
     */
    token: string;
}
